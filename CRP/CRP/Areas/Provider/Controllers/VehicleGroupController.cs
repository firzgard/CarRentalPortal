using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;
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
        VehicleGroupService service = new VehicleGroupService();
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
            var list = service.getAll().ToList();
            var result = list.Select(q => new IConvertible[] {
                q.ID,
                q.Name,
                q.MaxRentalPeriod != null ? q.MaxRentalPeriod : null,
                q.PriceGroup.Deposit,
                q.PriceGroup.PerDayPrice,
                q.Vehicles.Count,
                q.IsActive
            });
            return Json(new { aaData = result }, JsonRequestBehavior.AllowGet);
		}

        // Show create popup
        [Route("management/vehicleGroupManagement/create")]
        [HttpGet]
        public ViewResult CreateVehicleGroup()
        {
            VehicleGroupViewModel viewModel = new VehicleGroupViewModel();
            return View("~/Areas/Provider/Views/VehicleGroup/CreatePopup.cshtml", viewModel);
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

		// API Route to delete single group
		[Route("api/vehicleGroups/{id:int}")]
		[HttpDelete]
		public JsonResult DeleteVehicleGroupAPI(int id)
		{
			return Json("");
		}
	}
}