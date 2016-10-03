using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;

namespace CRP.Controllers
{
	public class VehicleController : Controller
	{
		// Route to vehicleManagement page
		[Route("management/vehicleManagement")]
		public ViewResult VehicleManagement()
		{
			return View("~/Areas/Provider/Views/Vehicle/VehicleManagement.cshtml");
		}

		// Route to vehicle's detailed info page
		[Route("management/vehicleManagement/{id:int}")]
		public ViewResult VehihicleDetail()
		{
			return View("~/Areas/Provider/Views/Vehicle/VehicleDetail.cshtml");
		}

		// API Route to get a list of vehicle to populate vehicleTable
		// Only vehicle tables need this API because their possibly huge number of record
		// So we need this API for server-side pagination
		[Route("api/vehicles")]
		[HttpGet]
		public JsonResult GetVehicleListAPI()
		{
			var vehicle = new Vehicle() { Id = 666, Name = "BWM X7" };

			return Json(vehicle);
		}

		// API Route for getting vehicle's detailed infomations (for example, to duplicate vehicle)
		[Route("api/vehicles/{id}")]
		[HttpGet]
		public JsonResult GetVehicleDetailAPI()
		{
			var vehicle = new Vehicle() { Id = 666, Name = "BWM X7" };

			return Json(vehicle);
		}

		// API Route to create single new vehicles
		[Route("api/vehicles")]
		[HttpPost]
		public JsonResult CreateVehicleAPI()
		{
			return Json("");
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
		public JsonResult DeleteVehiclesAPI()
		{
			return Json("");
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