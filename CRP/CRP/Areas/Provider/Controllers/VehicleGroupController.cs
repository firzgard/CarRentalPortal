using AutoMapper.QueryableExtensions;
using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{

	public class VehicleGroupController : BaseController
	{
        //VehicleGroupService service = new VehicleGroupService();
		// Route to vehicleGroupManagement page
		[Route("management/vehicleGroupManagement")]
		public ViewResult VehicleGroupManagement()
		{
			return View("~/Areas/Provider/Views/VehicleGroup/VehicleGroupManagement.cshtml");
		}

		// Route to group's detailed info page
		[Route("management/vehicleGroupManagement/{id:int}")]
		public ViewResult VehicleGroupDetail(int id)
		{
            var service = new VehicleGroupService();
            VehicleGroup model = service.findByID(id);
            VehicleGroupViewModel viewModel = new VehicleGroupViewModel(model);
			return View("~/Areas/Provider/Views/VehicleGroup/VehicleGroupDetail.cshtml", viewModel);
		}

		// API Route to get list of group
		[Route("api/vehicleGroups")]
		[HttpGet]
		public JsonResult GetVehicleGroupListAPI()
		{
            var service = new VehicleGroupService();
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
        [ValidateAntiForgeryToken]
		public JsonResult CreateVehicleGroupAPI(VehicleGroupViewModel model)
		{
            if (!this.ModelState.IsValid)
            {
                return Json(new { result = false, message = "Invalid!" });
            }
            var service = new VehicleGroupService();
            model.IsActive = true;
            var entity = this.Mapper.Map<VehicleGroup>(model);
            bool result = service.add(entity);

            if(!result)
            {
                return Json(new { result = false, message = "Create failed!" });
            }
            return Json(new { result = true, message = "Create successful!" });
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