using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{

	public class VehicleGroupController : Controller
	{
        VehicleGroupService service = VehicleGroupService.getInstance();
		// Route to vehicleGroupManagement page
		[Route("management/vehicleGroupManagement")]
		public ViewResult VehicleGroupManagement()
		{
			return View("~/Areas/Provider/Views/VehicleGroup/VehicleGroupManagement.cshtml");
		}

		// Route to group's detailed info page
		[Route("management/vehicleGroupManagement/{id:int}")]
		public ViewResult VehicleGroupDetail()
		{
			return View("~/Areas/Provider/Views/VehicleGroup/VehicleGroupDetail.cshtml");
		}

		// API Route to get list of group
		[Route("api/vehicleGroups")]
		[HttpGet]
		public JsonResult GetVehicleGroupListAPI()
		{
            var list = service.getAll();
			return Json(list);
		}

        // Show create popup
        [Route("management/vehicleGroupManagement/create")]
        [HttpGet]
        public ViewResult CreateVehicleGroup()
        {
            
            return View("");
        }

		// API Route to create single new group
		[Route("api/vehicleGroups")]
		[HttpPost]
		public JsonResult CreateVehicleGroupAPI()
		{
			return Json("");
		}

		// API Route to edit single group
		[Route("api/vehicleGroups")]
		[HttpPatch]
		public JsonResult EditVehicleGroupAPI()
		{
			return Json("");
		}

		// API route for toggling isActive (Deactivate/Reactivate) of single group
		[Route("api/vehicleGroups/toggleIsActive/{id:int}")]
		[HttpPatch]
		public JsonResult ToogleIsActiveAPI(int id)
		{
			return Json("");
		}

		// API Route to delete single group
		[Route("api/vehicleGroups/{id:int}")]
		[HttpDelete]
		public JsonResult DeleteVehicleGroupAPI(int id)
		{
			return Json("");
		}
	}
}