﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.Entities;
using CRP.Models.JsonModels;

namespace CRP.Areas.Provider.Controllers
{
	public class VehicleController : Controller
	{
        VehicleService service = new VehicleService();
        ModelService serviceModel = new ModelService();
        BrandService serviceBrand = new BrandService();
        GarageService serviceGara = new GarageService();
        VehicleService serviceVehi = new VehicleService();

		// Route to vehicleManagement page
		[Route("management/vehicleManagement")]
		public ViewResult VehicleManagement()
		{
            List<Vehicle> lstVehicle = new List<Vehicle>();
            lstVehicle = service.getAll();
            ViewBag.vehiList = lstVehicle;
            return View("~/Areas/Provider/Views/Vehicle/VehicleManagement.cshtml");
		}

		// Route to vehicle's detailed info page
		[Route("management/vehicleManagement/{id:int}")]
		public ViewResult VehihicleDetail(int id)
		{
            Vehicle vehicle = service.findByID(id);
            if (vehicle != null)
            {
                ViewBag.vehiDetail = vehicle;
            }
            else
            {
                return View("errorNull");
            }
            return View("~/Areas/Provider/Views/Vehicle/VehicleDetail.cshtml");
		}

		// API Route to get a list of vehicle to populate vehicleTable
		// Only vehicle tables need this API because their possibly huge number of record
		// So we need this API for server-side pagination
		[Route("api/vehicles")]
		[HttpGet]
		public JsonResult GetVehicleListAPI()
		{
            //var vehicle = new Vehicle() { Id = 666, Name = "BWM X7" };
            List<Vehicle> lstVehicle = new List<Vehicle>();
            List<VehicleModel> jsonVehicles = new List<VehicleModel>();
            lstVehicle = service.getAll();
            foreach(Vehicle p in lstVehicle)
            {
                VehicleModel jsonVehicle = new VehicleModel();
                jsonVehicle.ID = p.ID;
                jsonVehicle.LicenseNumber = p.LicenseNumber;
                jsonVehicle.Name = p.Name;
                jsonVehicle.ModelID = p.ModelID;
                //serviceModel.findBrandID = service(model);
                jsonVehicle.ModelName = serviceModel.reModelNameByID(jsonVehicle.ModelID);
                jsonVehicle.BrandID = serviceModel.findBrandID(p.ModelID);
                jsonVehicle.BrandName = serviceBrand.reBrandNameByID(jsonVehicle.BrandID);
                jsonVehicle.GarageID = p.GarageID;
                jsonVehicle.GarageName = serviceGara.reGarageNameByID(jsonVehicle.GarageID);
                jsonVehicle.VehicleGroupID = p.VehicleGroupID;
                jsonVehicle.TransmissionTypeID = p.TransmissionType;
                //jsonVehicle.TransmissionTypeName =;
                jsonVehicle.FuelTypeID = p.FuelType;
                //FuelTypeName
                jsonVehicle.ColorID = p.Color;
                //color
                jsonVehicle.Star = p.Star;
                //NumbOf
                jsonVehicle.NumOfDoor = serviceModel.reNumOfDoorByID(jsonVehicle.ModelID);
                jsonVehicle.NumOfSeat = serviceModel.reNumOfSeatByID(jsonVehicle.ModelID);

                jsonVehicles.Add(jsonVehicle);
            }

            return Json(jsonVehicles, JsonRequestBehavior.AllowGet);
		}

		// API Route for getting vehicle's detailed infomations (for example, to duplicate vehicle)
		[Route("api/vehicles/{id}")]
		[HttpGet]
		public JsonResult GetVehicleDetailAPI(int id)
		{
            //var vehicle = new Vehicle() { id = 666, Name = "BWM X7" };
            Vehicle nVehicle = new Vehicle();
            VehicleModel vehiModel = new VehicleModel();
            nVehicle = service.findByID(id);
            

            return Json("");
		}

		// API Route to create single new vehicles
		[Route("api/vehicles")]
		[HttpPost]
		public JsonResult CreateVehicleAPI()
		{
            MessageViewModels jsonResult = new MessageViewModels();
            string LicenNumb = Request.Params["LicenseNumber"];
            string Name = Request.Params["Name"];
            //int ModelID = int.Parse(Request.Params["ModelID"]);
            //string ModelName = Request.Params["ModelName"];
            //int BrandID = int.Parse(Request.Params["BrandID"]);
            //string BrandName = Request.Params["BrandName"];
            //int GarageID = int.Parse(Request.Params["GarageID"]);
            //string GarageName = Request.Params["GarageName"];
            //int VehicleGroupID = int.Parse(Request.Params["VehicleGroupID"]);
            //string VehicleName = Request.Params["VehicleName"];
            //int TransmissionTypeID = int.Parse(Request.Params["TransmissionTypeID"]);
            //string TransmissionTypeName = Request.Params["TransmissionTypeName"];
            //int FuelTypeID = int.Parse(Request.Params["FuelTypeID"]);
            //string FuelTypeName = Request.Params["FuelTypeName"];
            //int ColorID = int.Parse(Request.Params["ColorID"]);
            //string ColorName = Request.Params["ColorName"];
            int NumOfDoor = int.Parse(Request.Params["NumOfDoor"]);
            int NumOfSeat = int.Parse(Request.Params["NumOfSeat"]);

            Vehicle nVehicle = new Vehicle();
            nVehicle.LicenseNumber = LicenNumb;
            nVehicle.Name = Name;

            if (service.add(nVehicle))
            {
                jsonResult.StatusCode = 1;
                jsonResult.Msg = "Create successfully!";
            }
            else
            {
                jsonResult.StatusCode = 0;
                jsonResult.Msg = "Creare failed!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

		// API Route to edit single vehicle
		[Route("api/vehicles")]
		[HttpPatch]
		public JsonResult EditVehicleAPI()
		{
			return Json("");
		}

		// API Route to delete 1 or multiple vehicles
		[Route("api/vehicles")]
		[HttpDelete]
		public JsonResult DeleteVehiclesAPI(int id)
		{
            MessageViewModels jsonResult = new MessageViewModels();
            Boolean result = service.delete(id);
            if (result)
            {
                jsonResult.StatusCode = 1;
                jsonResult.Msg = "Deleted successfully!";
            }
            else
            {
                jsonResult.StatusCode = 0;
                jsonResult.Msg = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }

		// API Route for guest/customer to search vehicle for booking
		[Route("api/vehicles/search")]
		[HttpGet]
		public JsonResult SearchVehiclesAPI()
		{
			return Json("");
		}

		// API Route to change garage of multiple vehicles
		[Route("api/vehicles/changeGarage/{garageID:int}")]
		[HttpPatch]
		public JsonResult ChangeGarageAPI(int garageID)
		{
			return Json("");
		}

		// API Route to change group of multiple vehicles
		[Route("api/vehicles/changeGroup/{groupID:int}")]
		[HttpPatch]
		public JsonResult ChangeGroupAPI(int groupID)
		{
			return Json("");
		}

		// API route for creating an own booking
		[Route("api/vehicles/cancelBooking/{id:int}")]
		[HttpPost]
		public JsonResult CreateBookingAPI(int id)
		{
			return Json("");
		}

		// API route for canceling an own booking
		[Route("api/vehicles/cancelBooking/{id:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int id)
		{
			return Json("");
		}
	}
}