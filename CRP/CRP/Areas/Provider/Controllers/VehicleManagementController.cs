﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models.ViewModels;
using CRP.Models.Entities.Services;
using CRP.Models.Entities;
using CRP.Models.JsonModels;
using CRP.Controllers;
using CRP.Models;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace CRP.Areas.Provider.Controllers
{
	public class VehicleManagementController : BaseController
	{
		//VehicleService Service = new VehicleService();
		//ModelService serviceModel = new ModelService();
		//BrandService serviceBrand = new BrandService();
		//GarageService serviceGara = new GarageService();
		//BookingReceiptService serviceBook = new BookingReceiptService();

		// Route to vehicleManagement page
		[Authorize(Roles = "Provider")]
		[Route("management/vehicleManagement")]
		public ViewResult VehicleManagement()
		{
            var service = this.Service<IGarageService>();
            FilterByGarageView garageView = new FilterByGarageView();
            var providerID = User.Identity.GetUserId();
            garageView.listGarage = service.Get()
                .Where(q => q.OwnerID == providerID)
                .Select(q => new SelectListItem()
            {
                Text = q.Name,
                Value = q.ID.ToString(),
                Selected = true,
            });
            return View("~/Areas/Provider/Views/VehicleManagement/VehicleManagement.cshtml", garageView);
		}

		// Route to vehicle's detailed info page
		[Authorize(Roles = "Provider")]
		[Route("management/vehicleManagement/{id:int}")]
		public ViewResult VehihicleDetail(int id)
		{
			var service = this.Service<IVehicleService>();
            var garageService = this.Service<IGarageService>();
            var groupService = this.Service<IVehicleGroupService>();
            var brandService = this.Service<IBrandService>();
            var modelService = this.Service<IModelService>();
            Vehicle vehicle = service.Get(id);
            VehicleDetailInfoModel vehiIn = new VehicleDetailInfoModel(vehicle);
            //FilterByGarageView garageView = new FilterByGarageView();
            var providerID = User.Identity.GetUserId();
            vehiIn.listGarage = garageService.Get()
                .Where(q => q.OwnerID == providerID)
                .Select(q => new SelectListItem()
                {
                    Text = q.Name,
                    Value = q.ID.ToString(),
                    Selected = true,
                });
            vehiIn.listGroup = groupService.Get()
                 .Where(q => q.OwnerID == providerID)
                 .Select(q => new SelectListItem()
                 {
                     Text = q.Name,
                     Value = q.ID.ToString(),
                     Selected = true,
                 });
            vehiIn.listBrand = brandService.Get()
                 .Select(q => new SelectListItem()
                 {
                     Text = q.Name,
                     Value = q.ID.ToString(),
                     Selected = true,
                 });
            vehiIn.listModel = modelService.Get()
                 .Select(q => new SelectListItem()
                 {
                     Text = q.Name,
                     Value = q.ID.ToString(),
                     Selected = true,
                 });
            return View("~/Areas/Provider/Views/VehicleManagement/VehicleDetail.cshtml", vehiIn);
		}

		// API Route to get a list of vehicle to populate vehicleTable
		// Only vehicle tables need this API because their possibly huge number of record
		// So we need this API for server-side pagination
		[Route("api/vehicles", Name = "GetVehicleListAPI")]
		[HttpGet]
		public ActionResult GetVehicleListAPI(VehicleManagementFilterConditionModel filterConditions)
		{
			if (filterConditions.Draw == 0)
				return new HttpStatusCodeResult(400, "Unqualified request");
			if (filterConditions.OrderBy != null
				&& typeof(VehicleManagementItemJsonModel).GetProperty(filterConditions.OrderBy) == null)
				return new HttpStatusCodeResult(400, "Invalid sorting property");

			filterConditions.ProviderID = User.Identity.GetUserId();

			var service = this.Service<IVehicleService>();
			var vehicles = service.FilterVehicle(filterConditions);

			return Json(vehicles, JsonRequestBehavior.AllowGet);
		}

		// API Route for getting vehicle's detailed infomations (for example, to duplicate vehicle)
		[Route("api/vehicles/{id}")]
		[HttpGet]
		public JsonResult GetVehicleDetailAPI(int id)
		{
			//var vehicle = new vehicle() { id = 666, name = "bwm x7" };
			var service = this.Service<IVehicleService>();
			Vehicle vehicle = service.Get(id);

			VehicleDetailInfoModel vehiclemodel = new VehicleDetailInfoModel(vehicle);

			return Json(vehiclemodel, JsonRequestBehavior.AllowGet);
		}

		// API Route to create single new vehicles
		[Route("api/vehicles")]
		[HttpPost]
		public async Task<ActionResult> CreateVehicleAPI(Vehicle model)
		{
			if (!this.ModelState.IsValid)
				return new HttpStatusCodeResult(403, "Created unsuccessfully");
			var service = this.Service<IVehicleService>();
			var ModelService = this.Service<IModelService>();
			var BrandService = this.Service<IBrandService>();
			var GarageService = this.Service<IGarageService>();
			var VehicleGroupService = this.Service<IVehicleGroupService>();
			var VehicleImageService = this.Service<IVehicleImageService>();

			var entity = this.Mapper.Map<Vehicle>(model);
			var ModelEntity = this.Mapper.Map<Model>(model.Model);
			var BrandEntity = this.Mapper.Map<Brand>(model.Model.Brand);
			var GarageEntity = this.Mapper.Map<Garage>(model.Garage);
			var VehicleGroupEntity = this.Mapper.Map<VehicleGroup>(model.VehicleGroup);
			var VehicleImageEntity = this.Mapper.Map<VehicleImage>(model.VehicleImages);

			if (entity == null || ModelEntity == null || BrandEntity == null 
					|| GarageEntity == null || VehicleGroupEntity == null || VehicleImageEntity == null)
				return new HttpStatusCodeResult(403, "Created unsuccessfully");

			await BrandService.CreateAsync(BrandEntity);
			await ModelService.CreateAsync(ModelEntity);
			await GarageService.CreateAsync(GarageEntity);
			await VehicleGroupService.CreateAsync(VehicleGroupEntity);
			await VehicleImageService.CreateAsync(VehicleImageEntity);
			await service.CreateAsync(entity);

			return new HttpStatusCodeResult(200, "Created successfully.");
		}

		// API Route to edit single vehicle
		[Route("api/vehicles")]
		[HttpPatch]
		public async Task<ActionResult> EditVehicleAPI(Vehicle model)
		{
			if (!this.ModelState.IsValid)
				return new HttpStatusCodeResult(400, "Updated unsuccessfully.");

			var service = this.Service<IVehicleService>();
			var ModelService = this.Service<IModelService>();
			var BrandService = this.Service<IBrandService>();
			var GarageService = this.Service<IGarageService>();
			var VehicleGroupService = this.Service<IVehicleGroupService>();
			var VehicleImageService = this.Service<IVehicleImageService>();

			var entity = this.Mapper.Map<Vehicle>(model);
			var ModelEntity = this.Mapper.Map<Model>(model.Model);
			var BrandEntity = this.Mapper.Map<Brand>(model.Model.Brand);
			var GarageEntity = this.Mapper.Map<Garage>(model.Garage);
			var VehicleGroupEntity = this.Mapper.Map<VehicleGroup>(model.VehicleGroup);
			var VehicleImageEntity = this.Mapper.Map<VehicleImage>(model.VehicleImages);

			if (entity == null || ModelEntity == null || BrandEntity == null
					|| GarageEntity == null || VehicleGroupEntity == null || VehicleImageEntity == null)
				return new HttpStatusCodeResult(403, "Updated unsuccessfully.");

			await BrandService.UpdateAsync(BrandEntity);
			await ModelService.UpdateAsync(ModelEntity);
			await GarageService.UpdateAsync(GarageEntity);
			await VehicleGroupService.UpdateAsync(VehicleGroupEntity);
			await VehicleImageService.UpdateAsync(VehicleImageEntity);
			await service.UpdateAsync(entity);

			return new HttpStatusCodeResult(200, "Updated successfully.");
		}

		// API Route to delete 1 or multiple vehicles
		[Route("api/vehicles")]
		[HttpDelete]
		public async Task<ActionResult> DeleteVehiclesAPI(int id)
		{
			var service = this.Service<IVehicleService>();
			var VehicleImageService = this.Service<IVehicleImageService>();
			var entity = await service.GetAsync(id);
			if (entity == null)
				return new HttpStatusCodeResult(403, "Deleted unsuccessfully.");

			var VehicleImageEntity = VehicleImageService.Get(q => q.CarID == id);
			if (VehicleImageEntity != null)
			{
				foreach (var item in VehicleImageEntity)
				{
					VehicleImageService.DeleteAsync(item);
				}
			}
			await service.DeleteAsync(entity);
			return new HttpStatusCodeResult(200, "Deleted successfully.");
		}

		// API Route to change garage of multiple vehicles
		[Route("api/vehicles/changeGarage/{garageID:int}")]
		[HttpPatch]
		public ActionResult ChangeGarageAPI(int garageID, List<int> listVehicleId)
		{
			var service = this.Service<IVehicleService>();
			List<Vehicle> lstVehicle = service.Get().ToList();
			List<Vehicle> listVehicleNeedChange = new List<Vehicle>();
			// 1 2 3 5 8 
			foreach (var item in listVehicleId)
			{
				Vehicle v = lstVehicle.FirstOrDefault(a => a.ID == item);
				v.GarageID = garageID;
				service.Update(v);
			}

			return new HttpStatusCodeResult(200, "Garage changed successfully.");
		}

		// API Route to change group of multiple vehicles
		[Route("api/vehicles/changeGroup/{groupID:int}")]
		[HttpPatch]
		public ActionResult ChangeGroupAPI(int groupID, List<int> listVehicleId)
		{
			var service = this.Service<IVehicleService>();
			List<Vehicle> lstVehicle = service.Get().ToList();
			List<Vehicle> listVehicleNeedChange = new List<Vehicle>();
			foreach (var item in listVehicleId)
			{
				Vehicle v = lstVehicle.FirstOrDefault(a => a.ID == item);
				v.VehicleGroupID = groupID;
				service.Update(v);
			}
			return new HttpStatusCodeResult(200, "Group changed successfully.");
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
		//need provider role
		[Route("api/vehicles/bookings/{vehiceID:int}")]
		[HttpPost]
		public async Task<HttpStatusCodeResult> CreateBookingAPI(BookingReceipt model, int vehicleID)
		{
			if (!this.ModelState.IsValid)
			{
				return new HttpStatusCodeResult(403, "Created unsuccessfully.");
			}

			var service = this.Service<IBookingReceiptService>();

			BookingReceipt newBooking = this.Mapper.Map<BookingReceipt>(model);
			newBooking.VehicleID = vehicleID;
			await service.CreateAsync(newBooking);

			return new HttpStatusCodeResult(200, "Created successfully.");
		}

		// API route for canceling an own booking
		[Route("api/vehicles/bookings/{receiptID:int}")]
		[HttpDelete]
		public ActionResult CancelBookingAPI(int receiptID)
		{
			var service = this.Service<IBookingReceiptService>();
			BookingReceipt br = service.Get(receiptID);
			br.IsCanceled = true;
			service.Update(br);

			return new HttpStatusCodeResult(200, "Deleted successfully");
		}
	}
}