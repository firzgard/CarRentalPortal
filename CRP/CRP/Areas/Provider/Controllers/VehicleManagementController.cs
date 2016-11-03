using System;
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
using CloudinaryDotNet.Actions;
using Microsoft.Ajax.Utilities;
using System.IO;

namespace CRP.Areas.Provider.Controllers
{
	public class VehicleManagementController : BaseController
	{

		// Route to vehicleManagement page
		[Authorize(Roles = "Provider")]
		[Route("management/vehicleManagement")]
		public ViewResult VehicleManagement()
		{
			var brandService = this.Service<IBrandService>();
			var brandList = brandService.Get(
				b => b.VehicleModels.Count != 0 // Only get brand w/ model
			).OrderBy(b => b.Name).ToList();

			var garageService = this.Service<IGarageService>();
			var providerID = User.Identity.GetUserId();
			var listGarage = garageService.Get(q => q.OwnerID == providerID)
					.Select(q => new SelectListItem()
					{
						Text = q.Name,
						Value = q.ID.ToString(),
						Selected = true,
					});

			var groupService = this.Service<IVehicleGroupService>();
			var groupList = groupService.Get(q => q.OwnerID == providerID)
					.Select(q => new SelectListItem()
					{
						Text = q.Name,
						Value = q.ID.ToString()
					});

			var viewModel = new FilterByGarageView()
			{
				listGarage = listGarage,
				GroupList = groupList,
				BrandList = brandList
			};

			return View("~/Areas/Provider/Views/VehicleManagement/VehicleManagement.cshtml", viewModel);
		}

		// Load listOtherGarage
		[Authorize(Roles = "Provider")]
		[Route("api/listOtherGarage/{garageID:int}")]
		[HttpGet]
		public JsonResult LoadOtherGarage(int garageID)
		{
			var service = this.Service<IGarageService>();
			FilterByGarageView garageView = new FilterByGarageView();
			var providerID = User.Identity.GetUserId();
			garageView.listGarage = service.Get()
				.Where(q => q.OwnerID == providerID && q.IsActive && q.ID != garageID)
				.Select(q => new SelectListItem() {
					Text = q.Name,
					Value = q.ID.ToString(),
					Selected = true,
				});

			return Json(new { list = garageView.listGarage }, JsonRequestBehavior.AllowGet);
		}

		[Authorize(Roles = "Provider")]
		[Route("api/listGroup")]
		[HttpGet]
		public JsonResult LoadGroupList()
		{
			var service = this.Service<IVehicleGroupService>();
			// just use it to return a list not for keeping data purpose
			FilterByGarageView garageView = new FilterByGarageView();
			var providerID = User.Identity.GetUserId();
			garageView.listGarage = service.Get()
				.Where(q => q.OwnerID == providerID)
				.Select(q => new SelectListItem()
				{
					Text = q.Name + " ["+ (q.IsActive ? "đang hoạt động": "ngưng hoạt động") +"]",
					Value = q.ID.ToString(),
					Selected = true,
				});

			return Json(new { list = garageView.listGarage }, JsonRequestBehavior.AllowGet);
		}

		// Route to vehicle's detailed info page
		[Authorize(Roles = "Provider")]
		[Route("management/vehicleManagement/{id:int}")]
		public ActionResult VehihicleDetail(int id)
		{
			var providerID = User.Identity.GetUserId();
			var service = this.Service<IVehicleService>();
			var garageService = this.Service<IGarageService>();
			var groupService = this.Service<IVehicleGroupService>();
			var brandService = this.Service<IBrandService>();
			var modelService = this.Service<IModelService>();
			Vehicle vehicle = service.Get(v => v.ID == id && v.Garage.OwnerID == providerID).FirstOrDefault();
			if (vehicle == null)
			{
				return new HttpStatusCodeResult(403, "Error");
			}
			VehicleDetailInfoModel vehiIn = new VehicleDetailInfoModel(vehicle);
			//FilterByGarageView garageView = new FilterByGarageView();
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
            vehiIn.brandList = brandService.Get(
                b => b.VehicleModels.Count != 0 // Only get brand w/ model
            ).OrderBy(b => b.Name).ToList();
            //vehiIn.BrandList = brandService.Get(
            //    b => b.ID != 1 // Exclude unlisted brand
            //).OrderBy(b => b.Name).ToList();

            // Reorder each brand's models by name
            // Only get brand w/ model w/ registered vehicles
            //vehiIn.BrandList = vehiIn.BrandList.Aggregate(new List<VehicleBrand>(), (newBrandList, b) =>
            //{
            //    b.VehicleModels = b.VehicleModels.Aggregate(new List<VehicleModel>(), (newModelList, m) =>
            //    {
            //        if (m.Vehicles.Any())
            //            newModelList.Add(m);
            //        return newModelList;
            //    });

            //    if (b.VehicleModels.Any())
            //    {
            //        b.VehicleModels = b.VehicleModels.OrderBy(m => m.Name).ToList();
            //        newBrandList.Add(b);
            //    }

            //    return newBrandList;
            //});
            vehiIn.listBrand = brandService.Get()
				 .Select(q => new SelectListItem()
				 {
					 Text = q.Name,
					 Value = q.ID.ToString(),
					 Selected = true,
				 });
			vehiIn.listModel = brandService.Get()
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
			var service = this.Service<IVehicleService>();
			Vehicle vehicle = service.Get(id);

			return Json(new
			{
				Name = vehicle.Name,
				ModelID = vehicle.ModelID,
				Year = vehicle.Year,
				GarageID = vehicle.GarageID,
				VehicleGroupID = vehicle.VehicleGroupID,
				TransmissionType = vehicle.TransmissionType,
				TransmissionDetail = vehicle.TransmissionDetail,
				FuelType = vehicle.FuelType,
				Engine = vehicle.Engine,
				Color = vehicle.Color,
				Description = vehicle.Description
			}, JsonRequestBehavior.AllowGet);
		}


		// API Route to create single new vehicles
		[Route("api/vehicles")]
		[HttpPost]
		public async Task<ActionResult> CreateVehicleAPI(NewVehicleModel newVehicle)
		{
			var newVehicleEntity = this.Mapper.Map<Vehicle>(newVehicle);

			if (!CheckVehicleValidity(newVehicleEntity))
				return new HttpStatusCodeResult(400, "Created unsuccessfully");

			// Upload images
			var imageList = new List<VehicleImage>();
			foreach (string fileName in Request.Files)
			{
				var file = Request.Files[fileName];

				if (file?.ContentLength > 0)
				{
					var cloudinary = new CloudinaryDotNet.Cloudinary(Models.Constants.CLOUDINARY_ACC);

					// Upload to cloud
					var uploadResult = cloudinary.Upload(new ImageUploadParams()
					{
						File = new FileDescription(file.FileName, file.InputStream)
					});

					if (uploadResult == null)
						return new HttpStatusCodeResult(400, "Created unsuccessfully");

					// Get the image's id and url
					imageList.Add(new VehicleImage() { ID = uploadResult.PublicId, URL = uploadResult.Uri.ToString() });
				}
			}

			var vehicleService = this.Service<IVehicleService>();
			await vehicleService.CreateAsync(newVehicleEntity);

			foreach (var image in imageList)
			{
				image.VehicleID = newVehicleEntity.ID;
				image.Vehicle = newVehicleEntity;
			}

			newVehicleEntity.VehicleImages = imageList;
			await vehicleService.UpdateAsync(newVehicleEntity);

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
			//var ModelService = this.Service<IModelService>();
			//var BrandService = this.Service<IBrandService>();
			var GarageService = this.Service<IGarageService>();
			var VehicleGroupService = this.Service<IVehicleGroupService>();
			//var VehicleImageService = this.Service<IVehicleImageService>();

			var entity = this.Mapper.Map<Vehicle>(model);
			//var ModelEntity = this.Mapper.Map<VehicleModel>(model.VehicleModel);
			//var BrandEntity = this.Mapper.Map<VehicleBrand>(model.VehicleModel.VehicleBrand);
			//var GarageEntity = this.Mapper.Map<Garage>(model.Garage);
			//var VehicleGroupEntity = this.Mapper.Map<VehicleGroup>(model.VehicleGroup);
			//var VehicleImageEntity = this.Mapper.Map<VehicleImage>(model.VehicleImages);

			if (entity == null)
				return new HttpStatusCodeResult(403, "Updated unsuccessfully.");

			//await BrandService.UpdateAsync(BrandEntity);
			//await ModelService.UpdateAsync(ModelEntity);
			//await GarageService.UpdateAsync(GarageEntity);
			//await VehicleGroupService.UpdateAsync(VehicleGroupEntity);
			//await VehicleImageService.UpdateAsync(VehicleImageEntity);
			await service.UpdateAsync(entity);

			return new HttpStatusCodeResult(200, "Updated successfully.");
		}


		// API Route to delete
		[Route("api/vehicles/{id:int}")]
		[HttpDelete]
		public async Task<ActionResult> DeleteVehiclesAPI(int id)
		{
			var service = this.Service<IVehicleService>();
			var VehicleImageService = this.Service<IVehicleImageService>();
            var VehicleReceiptService = this.Service<IBookingReceiptService>();
			var entity = await service.GetAsync(id);
			if (entity == null)
				return new HttpStatusCodeResult(403, "Deleted unsuccessfully.");

			var VehicleImageEntity = VehicleImageService.Get(q => q.VehicleID == id);
            var ReceiptEntity = VehicleReceiptService.Get(q => q.VehicleID == id);

            if (ReceiptEntity != null)
            {
                foreach (var item in ReceiptEntity)
                {
                    item.VehicleID = null;
                }
            }

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


		[Route("Home/SaveUploadedFile/{VehicleID:int}")]
		public String SaveUploadedFile(int VehicleID)
		{
			var imageServie = this.Service<IVehicleImageService>();
			var vehicleService = this.Service<IVehicleService>();
			string fName = "";
			foreach (string fileName in Request.Files)
			{
				HttpPostedFileBase file = Request.Files[fileName];
				fName = file.FileName;
				if (file != null && file.ContentLength > 0)
				{

					String url = "";
					String userName = User.Identity.Name;
					String userID = User.Identity.GetUserId();
					CloudinaryDotNet.Account account =
					new CloudinaryDotNet.Account("ahihicompany",
										 "445384272838294",
										 "h4SCiNi8zOKfewxEi2LqNt3IjrQ"
											);
					CloudinaryDotNet.Cloudinary cloudinary = new CloudinaryDotNet.Cloudinary(account);
					//dinh dang image     
					var pic = file;
					if (pic != null)
					{
						CloudinaryDotNet.Actions.ImageUploadParams uploadParams = new CloudinaryDotNet.Actions.ImageUploadParams()
						{
							//File = new CloudinaryDotNet.Actions.FileDescription(@"c:\mypicture.jpg"),
							//PublicId = "sample_remote_file"
							File = new FileDescription(pic.FileName, pic.InputStream),
							Tags = "Anh cua" + userName,
						};
						CloudinaryDotNet.Actions.ImageUploadResult uploadResult = cloudinary.Upload(uploadParams);
						url = uploadResult.Uri.ToString();
						//luu xuong database
						VehicleImage imageOfVehicle = new VehicleImage();
						var Entity = vehicleService.Get(VehicleID);
						imageOfVehicle.URL = url;
						imageOfVehicle.VehicleID = VehicleID;
						imageOfVehicle.ID = uploadResult.PublicId.ToString();
						imageOfVehicle.Vehicle = Entity;
						imageServie.CreateAsync(imageOfVehicle);
						return uploadResult.PublicId.ToString();

					}
				}
			}
			return "";
		}

		[Route("api/vehicles/deletepic")]
		[HttpDelete]
		public void DeletePicinNew()
		{
			var vehicleService = this.Service<IVehicleService>();
			String id = Request.Params["file"];
			var vehicleImageService = this.Service<IVehicleImageService>();
			VehicleImage entityImage = vehicleImageService.Get(q => q.ID == id).FirstOrDefault();
			vehicleImageService.DeleteAsync(entityImage);
		}

		[Route("api/vehicles/deletepic/{id:int}")]
		[HttpDelete]
		public async Task<ActionResult> DeletePic(int id)
		{
			var vehicleService = this.Service<IVehicleService>();
			var entity = vehicleService.Get(id);
			string url = Request.Params["url2"];
			var vehicleImageService = this.Service<IVehicleImageService>();
			var lstVehiIm = vehicleImageService.Get(q => q.VehicleID == id);
			foreach (var item in lstVehiIm)
			{
				if (item.URL == url)
				{
					vehicleImageService.DeleteAsync(item);
				}
			}
			//for (int i = 0; i < listUpdate.Count; i++)
			//{
			//    var x = listUpdate.ElementAt(i);
			//    if (x.URL == url)
			//    {
			//        listUpdate.RemoveAt(i);

			//    }
			//}

			//entity.VehicleImages = listUpdate;

			await vehicleService.UpdateAsync(entity);
			return Json(new { result = true, message = "Deleted!" });
			//if (vehiEntity == null)
			//    return new HttpStatusCodeResult(403, "Deleted unsuccessfully.");
			//await VehicleImageService.DeleteAsync(entity);
		}

		// Check entity on create/update
		public bool CheckVehicleValidity(Vehicle vehicle)
		{
			var vehicleService = this.Service<IVehicleService>();
			var garageService = this.Service<IGarageService>();
			var groupService = this.Service<IVehicleGroupService>();
			var modelService = this.Service<IModelService>();

			//License number's uniquity
			if (vehicleService.Get().Any(v => v.LicenseNumber == vehicle.LicenseNumber))
				return false;

			if (vehicle.LicenseNumber.Length > 50 || vehicle.LicenseNumber.Length < 10)
				return false;

			if (vehicle.Name.Length > 100 || vehicle.Name.Length < 10)
				return false;

			if (!modelService.Get().Any(m => m.ID == vehicle.ModelID))
				return false;

			if (vehicle.Year < Models.Constants.MIN_YEAR || vehicle.Year > DateTime.Now.Year)
				return false;

			if (!garageService.Get().Any(g => g.ID == vehicle.GarageID))
				return false;

			if(vehicle.VehicleGroupID != null && !groupService.Get().Any(g => g.ID == vehicle.VehicleGroupID))
				return false;

			if(!Models.Constants.TRANSMISSION_TYPE.ContainsKey(vehicle.TransmissionType))
				return false;

			if (vehicle.FuelType != null && !Models.Constants.FUEL_TYPE.ContainsKey(vehicle.FuelType.Value))
				return false;

			if (vehicle.TransmissionDetail != null && vehicle.TransmissionDetail.Length > 100)
				return false;

			if (vehicle.Engine != null && vehicle.Engine.Length > 100)
				return false;

			if (vehicle.Description != null && vehicle.Description.Length > 1000)
				return false;

			if (!Models.Constants.COLOR.ContainsKey(vehicle.Color))
				return false;

			return true;
		}
	}
}