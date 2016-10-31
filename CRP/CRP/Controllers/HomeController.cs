﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;

namespace CRP.Controllers
{
	public class HomeController : BaseController
	{
		// Route to homepage
		public ActionResult Index()
		{
			var locationService = this.Service<ILocationService>();
			// Only get location w/ garage
			return View(locationService.Get(l => l.Garages.Count > 0).OrderBy(l => l.Name).ToList());
		}

		// Route to vehicle search results
		[Route("search", Name = "SearchPage")]
		public ActionResult Search()
		{
			var brandService = this.Service<IBrandService>();
			var brandList = brandService.Get(
				b => b.ID != 1 // Exclude unlisted brand
			).OrderBy(b => b.Name).ToList();

			// Reorder each brand's models by name
			// Only get brand w/ model w/ registered vehicles
			brandList = brandList.Aggregate(new List<VehicleBrand>(), (newBrandList, b) =>
			{
				b.VehicleModels = b.VehicleModels.Aggregate(new List<VehicleModel>(), (newModelList, m) =>
				{
					if (m.Vehicles.Any())
						newModelList.Add(m);
					return newModelList;
				});

				if (b.VehicleModels.Any())
				{
					b.VehicleModels = b.VehicleModels.OrderBy(m => m.Name).ToList();
					newBrandList.Add(b);
				}

				return newBrandList;
			});

			var categoryService = this.Service<ICategoryService>();
			var categoryList = categoryService.Get().OrderBy(c => c.Name).ToList();

			var locationService = this.Service<ILocationService>();
			// Only get location w/ garage
			var locationList = locationService.Get(l => l.Garages.Count > 0).OrderBy(l => l.Name).ToList();

			var priceGroupService = this.Service<IPriceGroupService>();
			var maxPerDayPrice = priceGroupService.Get().Max(pg => pg.PerDayPrice);
			var minPerDayPrice = priceGroupService.Get().Min(pg => pg.PerDayPrice);

			var priceGroupItemService = this.Service<IPriceGroupItemService>();
			var maxPriceGroupItemPrice = priceGroupItemService.Get().Max(pgi => pgi.Price);
			var minPriceGroupItemPrice = priceGroupItemService.Get().Min(pgi => pgi.Price);

			var maxPrice = maxPerDayPrice > maxPriceGroupItemPrice ? maxPerDayPrice : maxPriceGroupItemPrice;
			var minPrice = minPerDayPrice < minPriceGroupItemPrice ? minPerDayPrice : minPriceGroupItemPrice;

			var vehicleService = this.Service<IVehicleService>();
			var vehicles = vehicleService.Get();
			var maxYear = vehicles.Max(v => v.Year);
			var minYear = vehicles.Min(v => v.Year);

			return View(new SearchPageViewModel(brandList, categoryList, locationList, maxPrice, minPrice, maxYear, minYear));
		}

		// Route to vehicle's info
		[Route("vehicleInfo/{id:int}", Name = "VehicleInfo")]
		public ActionResult VehicleInfo(int id)
		{
			var vehicle = this.Service<IVehicleService>().Get(id);

			return View(vehicle);
		}

		// API Route for guest/customer to search vehicle for booking
		// Need filtering/sorting support
		[HttpGet]
		[Route("api/search", Name = "SearchVehiclesAPI")]
		public ActionResult SearchVehiclesAPI(SearchConditionModel searchConditions)
		{
			if (searchConditions?.StartTime == null
					|| searchConditions.EndTime == null
					|| searchConditions.StartTime.Value < DateTime.Now.AddHours(Constants.SOONEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_HOUR)
					|| searchConditions.StartTime.Value > DateTime.Now.AddDays(Constants.LATEST_POSSIBLE_BOOKING_START_TIME_FROM_NOW_IN_DAY)
					|| searchConditions.EndTime.Value < DateTime.Now.AddHours(Constants.SOONEST_POSSIBLE_BOOKING_END_TIME_FROM_NOW_IN_HOUR))
				return new HttpStatusCodeResult(400, "Invalid booking time");

			if (searchConditions.MaxPrice != null && searchConditions.MinPrice != null
					&& searchConditions.MaxPrice < searchConditions.MinPrice)
				return new HttpStatusCodeResult(400, "Invalid price span");

			if (searchConditions.MaxProductionYear != null && searchConditions.MinProductionYear != null
					&& searchConditions.MaxProductionYear < searchConditions.MinProductionYear)
				return new HttpStatusCodeResult(400, "Invalid production year range");

			if (!(searchConditions.OrderBy == null
					|| Constants.ALLOWED_SORTING_PROPS_IN_SEARCH_PAGE.Any(r => r.Name == searchConditions.OrderBy)))
				return new HttpStatusCodeResult(400, "Invalid sorting property");

			Response.StatusCode = 200;
			Response.StatusDescription = "Queried successfully";

			var service = this.Service<IVehicleService>();
			var searchResult = service.SearchVehicle(searchConditions);
			return Json(searchResult, JsonRequestBehavior.AllowGet);
		}
		
		// API route for getting booking calendar of a vehicle
		// Only get bookingReceipt of the next 30 days from this moment
		[Route("api/bookings/calendar/{vehicleID:int}", Name = "GetBookingCalendarAPI")]
		[HttpGet]
		public async Task<ActionResult> GetBookingCalendarAPI(int? vehicleID)
		{
			if(vehicleID == null)
				return new HttpStatusCodeResult(400, "Bad request");

			var vehicleService = this.Service<IVehicleService>();
			var vehicle = await vehicleService.GetAsync(vehicleID.Value);

			if(vehicle == null)
				return new HttpStatusCodeResult(404, "Vehicle not found");

			var bookings = vehicle.BookingReceipts
					.Where(br => !br.IsCanceled && br.EndTime >= DateTime.Now)
					.Select(br => new
						{
							start = br.StartTime.ToUniversalTime().ToString("o")
							, end = br.EndTime.ToUniversalTime().ToString("o")
						});

			return Json(bookings, JsonRequestBehavior.AllowGet);
		}

		// API route for getting comments of a vehicle
		// Order by endTime - desc
		// Pagination needed
		[Route("api/bookings/comments/{vehicleID:int}", Name = "GetCommentAPI")]
		[HttpGet]
		public async Task<ActionResult> GetCommentAPI(int? vehicleID, int page = 1)
		{
			if (vehicleID == null)
				return new HttpStatusCodeResult(400, "Bad request");

			var vehicleService = this.Service<IVehicleService>();
			var vehicle = await vehicleService.GetAsync(vehicleID.Value);

			if (vehicle == null)
				return new HttpStatusCodeResult(404, "Vehicle not found");
			
			var comments = vehicle.BookingReceipts
					// Get only the ones with comment
					.Where(br => br.Comment != null)
					// Sort
					.OrderByDescending(br => br.EndTime)
					// Paginate
					.Skip((page - 1) * Constants.NUM_OF_COMMENT_PER_PAGE)
					.Take(Constants.NUM_OF_COMMENT_PER_PAGE)
					// Parse into json model
					.Select(br => new
					{
						customer = br.AspNetUser.UserName
						, avatarURL = br.AspNetUser.AvatarURL
						, comment = Regex.Replace(br.Comment, @"\r\n?|\n", "<br>")
						, star = br.Star
					});

			return Json(comments, JsonRequestBehavior.AllowGet);
		}
	}
}