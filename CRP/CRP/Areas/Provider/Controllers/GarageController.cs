using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.Entities;

namespace CRP.Areas.Provider.Controllers
{
	public class GarageController : Controller
	{
		GarageService service = new GarageService();

		// Route to garageManagement page
		[Route("management/garageManagement")]
		public ViewResult GarageManagement()
		{
            List<Garage> lstGarage = new List<Garage>();
            lstGarage = service.getAll();
            ViewBag.garaList = lstGarage;
            return View("~/Areas/Provider/Views/Garage/GarageManagement.cshtml");
		}

		// Route to garage's detailed info page
		[Route("management/garageManagement/{id:int}")]
		public ViewResult GarageManagement(int id)
		{
            Garage garage = service.findByID(id);
            if (garage != null) {
                ViewBag.garaDetail = garage;
            } else
            {
                return View("errorNull");
            }
            return View("~/Areas/Provider/Views/Garage/GarageDetail.cshtml");
		}

		// API Route to get list of garage
		[Route("api/garages")]
		[HttpGet]
		public JsonResult GetGarageListAPI()
		{
			return Json("");
		}

		// API Route to create single new garage
		[Route("api/garages")]
		[HttpPost]
		public Object CreateGarageAPI()
		{

			return Json("");
		}

		// API Route to edit single garage
		[Route("api/garages")]
		[HttpPatch]
		public JsonResult EditGarageAPI()
		{
			return Json("");
		}

		// API route for toggling isActive (Deactivate/Reactivate) of single garage
		[Route("api/garages/toggleIsActive/{id:int}")]
		[HttpPatch]
		public JsonResult ToogleIsActiveAPI(int id)
		{
			return Json("");
		}

		// API Route to delete single garage
		[Route("api/garages/{id:int}")]
		[HttpDelete]
		public JsonResult DeleteGarageAPI(int id)
		{
			return Json("");
		}

		//// GET: Brand
		public ActionResult Index()
		{
		List<Garage> lstGara = new List<Garage>();
	    lstGara = service.getAll();
		ViewBag.garaList = lstGara;
		return View();
		}
		//POST: Provider/CarBrand/Delete/5
		//[HttpPost]
		//public String Delete()
		//{
		//	int ID = int.Parse(Request.Params["id"]);
		//	if (service.delete(ID))
		//	{
		//		return "true";
		//	}
		//	return "false";
		//}
	}
}