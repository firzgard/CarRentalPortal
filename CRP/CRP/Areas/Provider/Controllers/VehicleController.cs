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
		public ViewResult VehihicleDetail(int id)
		{
			return View("~/Areas/Provider/Views/Vehicle/VehicleDetail.cshtml");
		}

		// API Route to get a list of vehicle to populate vehicleTable
		// Allow filtering
		// Server-side pagination needed
		// Search/Filter/SortBy ability needed
		[Route("api/vehicles")]
		[HttpGet]
		public JsonResult GetVehicleListAPI()
		{
			var vehicle = new Vehicle() { Id = 666, Name = "BWM X7" };

			return Json(vehicle);
		}

		// API Route to get a vehicle's detailed info (To duplicate that vehicle, for example)
		[Route("api/vehicles/{id:int}")]
		[HttpGet]
		public JsonResult GetVehicleDetailAPI(int id)
		{
			var vehicle = new Vehicle() { Id = 666, Name = "BWM X7" };

			return Json(vehicle);
		}

		// API Route to create/duplicate single new vehicles
		[Route("api/vehicles")]
		[HttpPost]
		public JsonResult CreateVehicleAPI()
		{
			return Json("");
		}

		// API Route for updating vehicle's info
		[Route("api/vehicles")]
		[HttpPatch]
		public JsonResult EditVehicleAPI()
		{
			return Json("");
		}

		// API Route to delete 1 or multiple vehicles
		[Route("form/vehicles/delete")]
		[HttpDelete]
		public JsonResult DeleteVehiclesAPI()
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

		// API Route to create an own booking
		[Route("form/vehicles/createBooking")]
		[HttpPost]
		public JsonResult CreateOwnBookingAPI()
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