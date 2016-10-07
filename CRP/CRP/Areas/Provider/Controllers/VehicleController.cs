using System;
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
        BookingService serviceBook = new BookingService();

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
		[Route("api/vehicles/datatables")]
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
            //int NumOfDoor = int.Parse(Request.Params["NumOfDoor"]);
            //int NumOfSeat = int.Parse(Request.Params["NumOfSeat"]);

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
		public JsonResult EditVehicleAPI(int id)
		{
            MessageViewModels jsonResult = new MessageViewModels();
            string LicenNumb = Request.Params["LicenseNumber"];
            string Name = Request.Params["Name"];

            Vehicle editVehicle = service.findByID(id);
            editVehicle.LicenseNumber = LicenNumb;
            editVehicle.Name = Name;
            if (service.add(editVehicle))
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

		// API Route to change garage of multiple vehicles
		[Route("api/vehicles/changeGarage/{garageID:int}")]
		[HttpPatch]
		public JsonResult ChangeGarageAPI(int garageID, List<int> listVehicleId)
		{
            List<Vehicle> lstVehicle = service.getAll();
            List<Vehicle> listVehicleNeedChange = new List<Vehicle>();
            // 1 2 3 5 8 
            foreach (var item in listVehicleId)
            {
                Vehicle v = lstVehicle.FirstOrDefault(a => a.ID == item);
                v.GarageID = garageID;
                service.UpdateVehicle(v);
            }
            
            return Json(lstVehicle, JsonRequestBehavior.AllowGet);
		}

		// API Route to change group of multiple vehicles
		[Route("api/vehicles/changeGroup/{groupID:int}")]
		[HttpPatch]
		public JsonResult ChangeGroupAPI(int groupID, List<int> listVehicleId)
		{
            List<Vehicle> lstVehicle = service.getAll();
            List<Vehicle> listVehicleNeedChange = new List<Vehicle>();
            foreach (var item in listVehicleId)
            {
                Vehicle v = lstVehicle.FirstOrDefault(a => a.ID == item);
                v.VehicleGroupID = groupID;
                service.UpdateVehicle(v);
            }
            return Json(lstVehicle, JsonRequestBehavior.AllowGet);
		}

		// API route for getting booking receipts of a vehicle
        // Pagination needed
        // Order by booking's startTime, newer to older
		[Route("api/vehicles/bookings/{vehiceID:int}/{page:int?}")]
		[HttpGet]
		public JsonResult CreateBookingAPI(int vehiceID, int page = 1)
		{
            List<BookingReceipt> br = serviceBook.findByVehicle(vehiceID);
            br.Sort((x, y) => DateTime.Compare(x.StartTime, y.StartTime));
			return Json(br, JsonRequestBehavior.AllowGet);
		}

		// API route for creating an own booking
		[Route("api/vehicles/bookings/{vehiceID:int}")]
		[HttpPost]
		public JsonResult CreateBookingAPI(int vehiceID)
		{
            List<BookingReceipt> br = serviceBook.findByVehicle(vehiceID);
            BookingReceiptModel brm = new BookingReceiptModel();
            //brm.ID = ;
			return Json("");
		}

		// API route for canceling an own booking
		[Route("api/vehicles/bookings/{receiptID:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int receiptID)
		{
			return Json("");
		}
	}
}