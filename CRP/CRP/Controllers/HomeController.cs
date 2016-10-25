using System;
using System.Collections.Generic;
using System.Linq;
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
			return View(locationService.Get().OrderBy(l => l.Name).ToList());
		}

		//[Route("testNganLuong", Name = "TestNganLuong")]
		//public ActionResult TestNganLuong()
		//{
		//	string payment_method = Request.Form["option_payment"];
		//	string str_bankcode = Request.Form["bankcode"];


		//	RequestInfo info = new RequestInfo();
		//	info.Merchant_id = "47990";
		//	info.Merchant_password = "2c91870ef1fc9e506d46c46fe61d3b08";
		//	info.Receiver_email = "megafirzen@gmai.com";

		//	info.cur_code = "vnd";
		//	info.bank_code = str_bankcode;

		//	info.Order_code = "Test code";
		//	info.Total_amount = "2000";
		//	info.fee_shipping = "0";
		//	info.Discount_amount = "0";
		//	info.order_description = "Test";
		//	info.return_url = "http://localhost/3000";
		//	info.cancel_url = "http://localhost/3001";

		//	info.Buyer_fullname = buyer_fullname.Value;
		//	info.Buyer_email = buyer_email.Value;
		//	info.Buyer_mobile = buyer_mobile.Value;

		//	APICheckoutV3 objNLChecout = new APICheckoutV3();
		//	ResponseInfo result = objNLChecout.GetUrlCheckout(info, payment_method);

		//	if (result.Error_code == "00")
		//	{
		//		return Redirect(result.Checkout_url);
		//	}

		//	return new HttpStatusCodeResult(400, "Invalid request");
		//}

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
			var locationList = locationService.Get().OrderBy(l => l.Name).ToList();

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

			return View(new VehicleInfoPageViewModel(vehicle));
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
	}
}