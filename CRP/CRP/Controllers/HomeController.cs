using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;

namespace CRP.Controllers
{
	public class HomeController : BaseController
	{
		// Route to homepage
		public ActionResult Index()
		{
			var locationService = this.Service<ILocationService>();
			return View(locationService.Get().OrderBy(l => l.Name).ToList());
		}

		// Route to vehicle search results
		[Route("search", Name = "SearchPage")]
		public ActionResult Search(DateTime? startTime, DateTime? endTime, int? locationID)
		{
			if(startTime != null)
				Response.Cookies["searchConditions"]["startTime"] = startTime.ToString();
			if (endTime != null)
				Response.Cookies["searchConditions"]["endTime"] = endTime.ToString();
			if (locationID != null)
				Response.Cookies["searchConditions"]["locationID"] = locationID.ToString();
			if(startTime != null || endTime != null || locationID != null)
				Response.Cookies["searchConditions"].Expires = DateTime.Now.AddHours(1);

			var brandService = this.Service<IBrandService>();
			var brandList = brandService.Get(
				b => b.ID != 1 // Exclude unlisted brand
			).OrderBy(b => b.Name).ToList();

			// Reorder each brand's models by name
			// Only get brand w/ model w/ registered vehicles
			brandList = brandList.Aggregate(new List<Brand>(), (newBrandList, b) =>
			{
				b.Models = b.Models.Aggregate(new List<Model>(), (newModelList, m) =>
				{
					if (m.Vehicles.Any())
						newModelList.Add(m);
					return newModelList;
				});

				if (b.Models.Any())
				{
					b.Models = b.Models.OrderBy(m => m.Name).ToList();
					newBrandList.Add(b);
				}

				return newBrandList;
			});

			var categoryService = this.Service<ICategoryService>();
			var categoryList = categoryService.Get().OrderBy(c => c.Name).ToList();

			var locationService = this.Service<ILocationService>();
			var locationList = locationService.Get().OrderBy(l => l.Name).ToList();

			var priceGroupService = this.Service<IPriceGroupService>();
			var maxPrice = priceGroupService.Get().Max(pg => pg.PerDayPrice);

			var vehicleService = this.Service<IVehicleService>();
			var vehicles = vehicleService.Get();
			var maxYear = vehicles.Max(v => v.Year);
			var minYear = vehicles.Min(v => v.Year);

			return View(new SearchPageViewModel(brandList, categoryList, locationList, maxPrice, maxYear, minYear));
		}

		// Route to vehicle's info
		[Route("vehicleInfo/{id:int}", Name = "VehicleInfo")]
		public ActionResult VehicleInfo(int id)
		{
			return View();
			
		}

		// API Route for guest/customer to search vehicle for booking
		// Need filtering/sorting support
		[HttpGet]
		[Route("api/search", Name = "SearchVehiclesAPI")]
		public ActionResult SearchVehiclesAPI(SearchConditionModel searchConditions)
		{
			var service = this.Service<IVehicleService>();
			if (searchConditions?.StartTime == null
					|| searchConditions.EndTime == null
					|| searchConditions.StartTime.Value < DateTime.Now.AddHours(Constants.SoonestPossibleBookingStartTimeFromNowInHour)
					|| searchConditions.StartTime.Value > DateTime.Now.AddDays(Constants.LatestPossibleBookingStartTimeFromNowInDay)
					|| searchConditions.EndTime.Value < DateTime.Now.AddHours(Constants.SoonestPossibleBookingEndTimeFromNowInHour))
				return new HttpStatusCodeResult(400, "Invalid booking time");

			if (searchConditions.MaxPrice != null
					&& searchConditions.MinPrice != null
					&& searchConditions.MaxPrice < searchConditions.MinPrice)
				return new HttpStatusCodeResult(400, "Invalid price span");

			if (!(searchConditions.OrderBy < Constants.AllowedSortingPropsInSearchPage.Count)
					|| searchConditions.OrderBy < 0)
				return new HttpStatusCodeResult(400, "Invalid sorting property");

			Response.StatusCode = 200;
			Response.StatusDescription = "Queried successfully";
			var searchResult = service.SearchVehicle(searchConditions);
			return Json(searchResult, JsonRequestBehavior.AllowGet);
		}
	}
}