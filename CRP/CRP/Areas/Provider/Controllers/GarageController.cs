using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.Entities;
using CRP.Models.JsonModels;
using Newtonsoft.Json;

namespace CRP.Areas.Provider.Controllers
{
	public class GarageController : Controller
	{
		GarageService service = new GarageService();

		// Route to garageManagement page
		[Route("management/garageManagement")]
		public ViewResult GarageManagement()
		{
            //phan nay se kiem tra authorize, kiem tra privider
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
            List<Garage> lstGarage = new List<Garage>();
            List<GarageModel> jsonGarages = new List<GarageModel>();
            //cho nay se get theo user
            lstGarage = service.getAll();
            foreach (Garage p in lstGarage)
            {
                GarageModel jsonGarage = new GarageModel();
                jsonGarage.ID = p.ID;
                jsonGarage.Name = p.Name;
                jsonGarage.LocationID = p.LocationID;
                jsonGarage.LocationName = "SomeWhere";
                jsonGarage.Address = p.Address;
                jsonGarage.Star = p.Star.GetValueOrDefault();
                jsonGarage.IsActive = p.IsActive;
                jsonGarages.Add(jsonGarage);
            }
            return Json(jsonGarages, JsonRequestBehavior.AllowGet);
        }

		// API Route to create single new garage
		[Route("api/garages")]
		[HttpPost]
		public JsonResult CreateGarageAPI()
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
            MessageViewModels jsonResult = new MessageViewModels();
            Boolean result = service.doActive(id);
            if (result)
            {
                jsonResult.StatusCode = 1;
            }
            else
            {
                jsonResult.StatusCode = 0;
                jsonResult.Msg = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

        // API Route to delete single garage
        [HttpDelete]
        [Route("api/garages/{id:int}")]
		public JsonResult DeleteGarageAPI(int id)
		{
            MessageViewModels jsonResult = new MessageViewModels();
            Boolean result = service.delete(id);
            if (result)
            {
                jsonResult.StatusCode = 1;
                jsonResult.Msg = "This Garage was be deleted!";
            } else
            {
                jsonResult.StatusCode = 0;
                jsonResult.Msg = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
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