﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
//using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.Entities;
using CRP.Models.JsonModels;
using CRP.Controllers;
using CRP.Models;
using System.Threading.Tasks;

namespace CRP.Areas.Provider.Controllers
{
	public class VehicleController : BaseController
	{
		//VehicleService Service = new VehicleService();
		//ModelService serviceModel = new ModelService();
		//BrandService serviceBrand = new BrandService();
		//GarageService serviceGara = new GarageService();
		//BookingReceiptService serviceBook = new BookingReceiptService();

		// Route to vehicleManagement page
		[Route("management/vehicleManagement")]
		public ViewResult VehicleManagement()
		{
			var service = this.Service<IVehicleService>();
			List<Vehicle> lstVehicle = new List<Vehicle>();
			lstVehicle = service.Get().ToList();
			//ViewBag.vehiList = lstVehicle;
			return View("~/Areas/Provider/Views/Vehicle/VehicleManagement.cshtml", lstVehicle);
		}

		// Route to vehicle's detailed info page
		[Route("management/vehicleManagement/{id:int}")]
		public ViewResult VehihicleDetail(int id)
		{
			var service = this.Service<IVehicleService>();
			Vehicle vehicle = service.Get(id);
			return View("~/Areas/Provider/Views/Vehicle/VehicleDetail.cshtml", vehicle);
		}

		// API Route to get a list of vehicle to populate vehicleTable
		// Only vehicle tables need this API because their possibly huge number of record
		// So we need this API for server-side pagination
		[Route("api/vehicles/datatables", Name = "vehiclesDatatables")]
		[HttpGet]
		public JsonResult GetVehicleListAPI(VehicelFilterConditionModel filterConditions)
		{
			var service = this.Service<IVehicleService>();
			VehicleDataTablesJsonModel vehicles = (VehicleDataTablesJsonModel) service.FilterVehicle(filterConditions);

			return Json(vehicles, JsonRequestBehavior.AllowGet);
		}

		// API Route for getting vehicle's detailed infomations (for example, to duplicate vehicle)
		/*[Route("api/vehicles/{id}")]
		[HttpGet]
		public JsonResult GetVehicleDetailAPI(int id)
		{
			//var vehicle = new Vehicle() { id = 666, Name = "BWM X7" };
			Vehicle nVehicle = new Vehicle();
			VehicleModel vehiModel = new VehicleModel();
			nVehicle = service.FindByID(id);
			vehiModel.ID = nVehicle.ID;
			vehiModel.LicenseNumber = nVehicle.LicenseNumber;
			vehiModel.Name = nVehicle.Name;
			vehiModel.ModelID = nVehicle.ModelID;
			vehiModel.ModelName = serviceModel.reModelNameByID(vehiModel.ModelID);
			vehiModel.BrandID = serviceModel.findBrandID(nVehicle.ModelID);
			vehiModel.BrandName = serviceBrand.reBrandNameByID(vehiModel.BrandID);
			vehiModel.GarageID = nVehicle.GarageID;
			vehiModel.GarageName = serviceGara.reGarageNameByID(vehiModel.GarageID);
			vehiModel.VehicleGroupID = nVehicle.VehicleGroupID;
			vehiModel.TransmissionTypeID = nVehicle.TransmissionType;
			//jsonVehicle.TransmissionTypeName =;
			vehiModel.FuelTypeID = nVehicle.FuelType;
			//FuelTypeName
			vehiModel.ColorID = nVehicle.Color;
			//color
			vehiModel.Star = nVehicle.Star;
			//NumbOf
			vehiModel.NumOfDoor = serviceModel.reNumOfDoorByID(vehiModel.ModelID);
			vehiModel.NumOfSeat = serviceModel.reNumOfSeatByID(vehiModel.ModelID);

			return Json(vehiModel, JsonRequestBehavior.AllowGet);
		}*/

		// API Route to create single new vehicles
		/*[Route("api/vehicles")]
		[HttpPost]
		public JsonResult CreateVehicleAPI()
		{
			MessageJsonModel jsonResult = new MessageJsonModel();
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
			//int NumOfDoor = int.Parse(Request.Params["NumOfDoor"]);
			//int NumOfSeat = int.Parse(Request.Params["NumOfSeat"]);

			Vehicle nVehicle = new Vehicle();
			nVehicle.LicenseNumber = LicenNumb;
			nVehicle.Name = Name;

			if (Service.Add(nVehicle))
			{
				jsonResult.Status = 1;
				jsonResult.Message = "Create successfully!";
			}
			else
			{
				jsonResult.Status = 0;
				jsonResult.Message = "Creare failed!";
			}
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

		// API Route to edit single vehicle
		[Route("api/vehicles")]
		[HttpPatch]
		public JsonResult EditVehicleAPI(int id)
		{
			MessageJsonModel jsonResult = new MessageJsonModel();
			string LicenNumb = Request.Params["LicenseNumber"];
			string Name = Request.Params["Name"];

			Vehicle editVehicle = Service.FindByID(id);
			editVehicle.LicenseNumber = LicenNumb;
			editVehicle.Name = Name;
			if (Service.Add(editVehicle))
			{
				jsonResult.Status = 1;
				jsonResult.Message = "Create successfully!";
			}
			else
			{
				jsonResult.Status = 0;
				jsonResult.Message = "Creare failed!";
			}
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}*/

		// API Route to delete 1 or multiple vehicles
		[Route("api/vehicles")]
		[HttpDelete]
		public async Task<JsonResult> DeleteVehiclesAPI(int id)
		{
			var service = this.Service<IVehicleService>();
			MessageJsonModel jsonResult = new MessageJsonModel();
			var entity = await service.GetAsync(id);
			if (entity != null)
			{
				await service.DeleteAsync(entity);
				jsonResult.Status = 1;
				jsonResult.Message = "Deleted successfully!";
			}
			else
			{
				jsonResult.Status = 0;
				jsonResult.Message = "Error!";
			}
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

		// API Route to change garage of multiple vehicles
		[Route("api/vehicles/changeGarage/{garageID:int}")]
		[HttpPatch]
		public JsonResult ChangeGarageAPI(int garageID, List<int> listVehicleId)
		{
			var service = this.Service<IVehicleService>();
			List<Vehicle> lstVehicle = service.Get().ToList();
			List<Vehicle> listVehicleNeedChange = new List<Vehicle>();
			// 1 2 3 5 8 
			/*foreach (var item in listVehicleId)
			{
				Vehicle v = lstVehicle.FirstOrDefault(a => a.ID == item);
				v.GarageID = garageID;
				Service.UpdateVehicle(v);
			}*/
			
			return Json(lstVehicle, JsonRequestBehavior.AllowGet);
		}

		// API Route to change group of multiple vehicles
		[Route("api/vehicles/changeGroup/{groupID:int}")]
		[HttpPatch]
		public JsonResult ChangeGroupAPI(int groupID, List<int> listVehicleId)
		{
			var service = this.Service<IVehicleService>();
			List<Vehicle> lstVehicle = service.Get().ToList();
			List<Vehicle> listVehicleNeedChange = new List<Vehicle>();
			/*foreach (var item in listVehicleId)
			{
				Vehicle v = lstVehicle.FirstOrDefault(a => a.ID == item);
				v.VehicleGroupID = groupID;
				Service.UpdateVehicle(v);
			}*/
			return Json(lstVehicle, JsonRequestBehavior.AllowGet);
		}

		// API route for getting booking receipts of a vehicle
		// Pagination needed
		// Order by booking's startTime, newer to older
		[Route("api/vehicles/bookings/{vehiceID:int}/{page:int?}")]
		[HttpGet]
		public JsonResult GetVehicleBookingAPI(int vehiceID, int page = 1)
		{
			var service = this.Service<IBookingReceiptService>();
			List<BookingReceipt> br = service.Get(q => q.VehicleID == vehiceID).ToList();
			br.Sort((x, y) => DateTime.Compare(x.StartTime, y.StartTime));
			return Json(br, JsonRequestBehavior.AllowGet);
		}

		// API route for creating an own booking
		/*[Route("api/vehicles/bookings/{vehiceID:int}")]
		[HttpPost]
		public JsonResult CreateBookingAPI(int vehiceID)
		{
			var service = this.Service<IBookingReceiptService>();
			MessageJsonModel jsonResult = new MessageJsonModel();
			string vehicleName = Request.Params["VehicleName"];
			DateTime startTime = DateTime.Parse(Request.Params["StartTime"]);
			DateTime endTime = DateTime.Parse(Request.Params["EndTime"]);
			BookingReceipt bookre = new BookingReceipt();
			bookre.StartTime = startTime;
			bookre.EndTime = endTime;
			if (serviceBook.add(bookre) )
			{
				jsonResult.Status = 1;
				jsonResult.Message = "Create successfully!";
			}
			else
			{
				jsonResult.Status = 0;
				jsonResult.Message = "Creare failed!";
			}
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}*/

		// API route for canceling an own booking
		[Route("api/vehicles/bookings/{receiptID:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int receiptID)
		{
			var service = this.Service<IBookingReceiptService>();
			MessageJsonModel jsonResult = new MessageJsonModel();
			BookingReceipt br = service.Get(receiptID);
			//while(serviceBook.CheckVehicleAvailability(br.VehicleID, br.StartTime, br.EndTime))
			//{
			//    Boolean result = service.delete(receiptID);
			//    if (result)
			//    {
			//        jsonResult.Status = 1;
			//        jsonResult.Message = "Deleted successfully!";
			//    }
			//    else
			//    {
			//        jsonResult.Status = 0;
			//        jsonResult.Message = "Error!";
			//    }
				
			//}
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}
	}
}