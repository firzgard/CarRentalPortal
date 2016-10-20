using AutoMapper.QueryableExtensions;
using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using CRP.Models.ViewModels;
using Microsoft.AspNet.Identity;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{

	public class VehicleGroupManagementController : BaseController
	{
        //VehicleGroupService service = new VehicleGroupService();
		// Route to vehicleGroupManagement page
		[Route("management/vehicleGroupManagement")]
		public ViewResult VehicleGroupManagement()
		{
			return View("~/Areas/Provider/Views/VehicleGroupManagement/VehicleGroupManagement.cshtml");
		}

		//// Route to group's detailed info page
		[Route("management/vehicleGroupManagement/{id:int}")]
		public ViewResult VehicleGroupDetail(int id)
		{
            var service = this.Service<IVehicleGroupService>();
            VehicleGroupViewModel viewModel = this.Mapper.Map<VehicleGroupViewModel> (service.Get(id));

            return View("~/Areas/Provider/Views/VehicleGroupManagement/VehicleGroupDetail.cshtml", viewModel);
		}

		// API Route to get list of group
		[Route("api/vehicleGroups")]
		[HttpGet]
		public JsonResult GetVehicleGroupListAPI()
		{
            var service = this.Service<IVehicleGroupService>();
            var list = service.Get().ToList();
            var result = list.Select(q => new IConvertible[] {
                q.ID,
                q.Name,
                q.MaxRentalPeriod != null ? q.MaxRentalPeriod : null,
                (q.PriceGroup.DepositPercentage * 100m).ToString("#") + "%",
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
            return View("~/Areas/Provider/Views/VehicleGroupManagement/CreatePopup.cshtml", viewModel);
        }

		// API Route to create single new group
        [Authorize(Roles = "Provider")]
		[Route("api/vehicleGroups")]
		[HttpPost]
		public async Task<JsonResult> CreateVehicleGroupAPI(VehicleGroup model)
		{
            if (!this.ModelState.IsValid)
            {
                return Json(new { result = false, message = "Invalid!" });
            }
            var service = this.Service<IVehicleGroupService>();
            var priceGroupService = this.Service<IPriceGroupService>();
            var priceGroupItemService = this.Service<IPriceGroupItemService>();
            model.OwnerID = User.Identity.GetUserId();
            model.IsActive = true;
            
            var entity = this.Mapper.Map<VehicleGroup>(model);
            var priceGroupEntity = this.Mapper.Map<PriceGroup>(model.PriceGroup);
            var priceGroupItemsEntity = model.PriceGroup.PriceGroupItems;

            if(entity == null || priceGroupEntity == null || priceGroupItemsEntity == null || priceGroupItemsEntity.Count == 0)
            {
                return Json(new { result = false, message = "Create failed!" });
            }

            // create follow this step
            // 1
            await priceGroupService.CreateAsync(priceGroupEntity);
            //2
            entity.DefaultPriceGroupID = priceGroupEntity.ID;
            await service.CreateAsync(entity);

            return Json(new { result = true, message = "Create successful!" });
        }

		// API Route to edit single group
		[Route("api/vehicleGroups")]
		[HttpPatch]
		public async Task<JsonResult> EditVehicleGroupAPI(VehicleGroupViewModel model)
		{
            if (!this.ModelState.IsValid)
            {
                return Json(new { result = false, message = "Invalid!" });
            }
            var service = this.Service<IVehicleGroupService>();
            var priceGroupService = this.Service<IPriceGroupService>();
            var priceGroupItemService = this.Service<IPriceGroupItemService>();

            var entity = this.Mapper.Map<VehicleGroup>(model);
            var priceGroupEntity = this.Mapper.Map<PriceGroup>(model.PriceGroup);
            var priceGroupItemEntity = this.Mapper.Map<PriceGroupItem>(model.PriceGroup.PriceGroupItems);

            if (entity == null || priceGroupEntity == null || priceGroupItemEntity == null)
            {
                return Json(new { result = false, message = "Update failed!" });
            }

            // update follow this step
            // 1
            await priceGroupItemService.UpdateAsync(priceGroupItemEntity);
            // 2
            await priceGroupService.UpdateAsync(priceGroupEntity);
            // 3
            await service.UpdateAsync(entity);

            return Json(new { result = true, message = "Update success!" });
        }

		// API Route to delete single group
		[Route("api/vehicleGroups/{id:int}")]
		[HttpDelete]
		public async Task<JsonResult> DeleteVehicleGroupAPI(int id)
		{
            var service = this.Service<IVehicleGroupService>();
            var priceGroupService = this.Service<IPriceGroupService>();
            var priceGroupItemService = this.Service<IPriceGroupItemService>();

            var entity = await service.GetAsync(id);
            if(entity != null)
            {
                var priceGroupEntity = await priceGroupService.GetAsync(entity.PriceGroup.ID);
                var priceGroupItemsEntity = priceGroupItemService.Get(q => q.PriceGroupID == priceGroupEntity.ID);
                if (priceGroupEntity != null)
                {
                    await service.DeleteAsync(entity);
                    foreach(var item in priceGroupItemsEntity)
                    {
                        priceGroupItemService.DeleteAsync(item);
                    }
                    await priceGroupService.DeleteAsync(priceGroupEntity);
                    

                    return Json(new { result = true, message = "Delete success!" });
                }
            }

            return Json(new { result = false, message = "Delete failed!" });
        }

        // API Route to deactive/active vehicle group
        [Route("api/vehicleGroups/status/{id:int}")]
        [HttpPatch]
        public async Task<JsonResult> ChangeStatus(int id)
        {
            var service = this.Service<IVehicleGroupService>();
            var entity = await service.GetAsync(id);
            if(entity != null)
            {
                entity.IsActive = !entity.IsActive;
                await service.UpdateAsync(entity);
                return Json(new { result = true, message = "Change status success!" });
            }

            return Json(new { result = false, message = "Change status failed!" });
        }
    }
}