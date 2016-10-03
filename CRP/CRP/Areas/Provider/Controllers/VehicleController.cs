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
		[Route("vehicleManagement")]
		public ViewResult VehicleManagement()
		{
			return View("~/Areas/Provider/Views/Vehicle/VehicleManagement.cshtml");
		}

		[Route("api/vehicleList")]
		public JsonResult getVehicleListJson()
		{
			var vehicle = new Vehicle() { Id = 666, Name = "BWM X7" };

			return Json(vehicle);
		}

		[Route("api/vehicleDetail/{id}")]
		public JsonResult getVehicleDetailJson()
		{
			var vehicle = new Vehicle() { Id = 666, Name = "BWM X7" };

			return Json (vehicle);
		}
	}
}