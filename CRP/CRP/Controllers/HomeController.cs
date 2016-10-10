using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;

namespace CRP.Controllers
{
	public class HomeController : Controller
	{
		VehicleService vehicleService = new VehicleService();

		// Route to homepage
		public ActionResult Index()
		{
			return View();
		}

		// Route to vehicle search results
		[Route("search")]
		public ActionResult Search()
		{
			LocationService locationService = new LocationService();
			return View(locationService.getAll().OrderBy(l => l.Name).ToList());
		}

		// Route to vehicle's info
		[Route("vehicleInfo/{id:int}")]
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
			if (searchConditions == null
					|| searchConditions.StartTime == null
					|| searchConditions.EndTime == null
					|| searchConditions.StartTime >= searchConditions.EndTime)
				return new HttpStatusCodeResult(400, "Invalid time span");

			Response.StatusCode = 200;
			Response.StatusDescription = "Queried successfully";
			SearchResultJsonModel searchResult = vehicleService.FindToBook(searchConditions);
			return Json(searchResult, JsonRequestBehavior.AllowGet);
		}
	}
}