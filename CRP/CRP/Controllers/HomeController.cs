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
			return View();
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
		public JsonResult SearchVehiclesAPI(SearchConditionModel searchConditions)
		{
			if (searchConditions == null
					|| searchConditions.StartTime == null
					|| searchConditions.EndTime == null)
				return Json(new MessageJsonModel("Bad request", 400));

			List<SearchResultJsonModel> searchResults = vehicleService.findToBook(searchConditions);
			return Json(new MessageJsonModel("OK", 200, searchResults), JsonRequestBehavior.AllowGet);
		}
	}
}