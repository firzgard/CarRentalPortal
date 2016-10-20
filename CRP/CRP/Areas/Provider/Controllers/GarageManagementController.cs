using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using Newtonsoft.Json;
using CRP.Controllers;
using AutoMapper.QueryableExtensions;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.AspNet.Identity;

namespace CRP.Areas.Provider.Controllers
{
	public class GarageManagementController : BaseController
	{
		// Route to garageManagement page
		[Route("management/garageManagement")]
		public ViewResult GarageManagement()
		{
			var locationService = this.Service<ILocationService>();
			List<Location> lstLocation = new List<Location>();
			lstLocation = locationService.Get().ToList();
			ViewBag.locationList = lstLocation;
			return View("~/Areas/Provider/Views/GarageManagement/GarageManagement.cshtml");
		}

		// Route to garage's detailed info page
		[Route("management/garageManagement/{id:int}")]
		public ViewResult GarageManagement(int id)
		{
			var service = this.Service<IGarageService>();
			Garage garage = service.Get(id);
			return View("~/Areas/Provider/Views/GarageManagement/GarageDetail.cshtml", garage);
		}

		// API Route to get list of garage
		[Route("api/garages")]
		[HttpGet]
		public JsonResult GetGarageListAPI()
		{
			String customerID = User.Identity.GetUserId();
			var service = this.Service<IGarageService>();
			var list = service.GetGarageList(customerID);
			var result = list.Select(q => new IConvertible[] {
				q.ID,
				q.Name,
				q.Address,
				q.Location.Name,
				q.Star,
				q.IsActive,
			});
			return Json(new { aaData = result }, JsonRequestBehavior.AllowGet);
		}

		// API Route to create single new garage
		// garageViewModel
		[Route("api/garages")]
		[HttpPost]
		public async Task<ActionResult> CreateGarageAPI(Garage model)
		{
			if (!this.ModelState.IsValid)
			{
				return new HttpStatusCodeResult(403, "Created unsuccessfully.");
			}
			var service = this.Service<IGarageService>();

			Garage newGarage = this.Mapper.Map<Garage>(model);
			await service.CreateAsync(newGarage);

			return new HttpStatusCodeResult(200, "Created successfully.");
		}

		// API Route to edit single garage
		// GarageViewModel
		[Route("api/garages")]
		[HttpPatch]
		public async Task<ActionResult> EditGarageAPI(Garage model)
		{
			if (!this.ModelState.IsValid)
				return new HttpStatusCodeResult(403, "Updated unsuccessfully.");

			var service = this.Service<IGarageService>();
			var entity = await service.GetAsync(model?.ID);
			if(entity == null)
				return new HttpStatusCodeResult(403, "Updated unsuccessfully.");

			this.Mapper.Map(model, entity);
			await service.UpdateAsync(entity);

			return new HttpStatusCodeResult(200, "Updated successfully.");
		}

		// API Route to delete single garage
		[Route("api/garages/{id:int}")]
		[HttpDelete]
		public async Task<ActionResult> DeleteGarageAPI(int id)
		{
			var service = this.Service<IGarageService>();
			var entity = await service.GetAsync(id);
			if (entity == null)
				return HttpNotFound();

			await service.DeleteAsync(entity);
			
			return new HttpStatusCodeResult(200, "Deleted successfully.");
		}

        [Route("management/GarageManagement/create")]
        [HttpGet]
        public ViewResult CreateGarage()
        {
            var locationService = this.Service<ILocationService>();
            List<Location> lstLocation = new List<Location>();
            lstLocation = locationService.Get().ToList();
            ViewBag.locationList = lstLocation;
            createNewGarageViewModel viewModel = new createNewGarageViewModel();
            return View("~/Areas/Provider/Views/VehicleGroupManagement/CreatePopup.cshtml", viewModel);
        }

        [Route("api/deleteGarage/{id:int}")]
        [HttpDelete]
        public async Task<JsonResult> DeleteVehicleGroupAPI(int id)
        {
            var service = this.Service<IGarageService>();
            var entity = await service.GetAsync(id);
            if (entity != null)
                    {
                    return Json(new { result = true, message = "Delete success!" });
                }

            return Json(new { result = false, message = "Delete failed!" });
        }

        [Route("api/garage/status/{id:int}")]
        [HttpPatch]
        public async Task<JsonResult> ChangeStatus(int id)
        {
            var service = this.Service<IGarageService>();
            var entity = await service.GetAsync(id);
            if (entity != null)
            {
                entity.IsActive = !entity.IsActive;
                await service.UpdateAsync(entity);
                return Json(new { result = true, message = "Change status success!" });
            }

            return Json(new { result = false, message = "Change status failed!" });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(createNewGarageViewModel model)
        {
            if (ModelState.IsValid)
            {
                var service = this.Service<IGarageService>();
                var garage = new Garage
                {
                    Name = model.GarageName,
                    Address = model.Address,
                    Email = model.Email,
                    Phone1 = model.PhoneNumber,
                    LocationID = int.Parse(model.LocationID),
                    OwnerID = User.Identity.GetUserId(),
                    IsActive = true
                };
                service.Create(garage);
            }

            // If we got this far, something failed, redisplay form
            return new HttpStatusCodeResult(403, "Created unsuccessfully.");
        }

        //// GET: Brand
        public ActionResult Index()
		{
			var service = this.Service<IGarageService>();
			List<Garage> lstGara = new List<Garage>();
			lstGara = service.Get().ToList();
			ViewBag.garaList = lstGara;
			return View();
		}

		//cai nay la de format thanh datetime cho may cai open close
		DateTime toDay = new DateTime();
		TimeSpan hourMinute = new TimeSpan();
		public DateTime setDayFromParam(String param)
		{
			hourMinute = TimeSpan.Parse(param);
			DateTime dateTime = toDay.Date + hourMinute;
			return dateTime.AddYears(2016);
		}
	}
}