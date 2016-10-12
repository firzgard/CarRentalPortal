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

namespace CRP.Areas.Provider.Controllers
{
	public class GarageController : BaseController
	{
		// Route to garageManagement page
		[Route("management/garageManagement")]
		public ViewResult GarageManagement()
		{
            var service = this.Service<IGarageService>();
            var locationService = this.Service<ILocationService>();

			List<Garage> lstGarage = new List<Garage>();
			List<Location> lstLocation = new List<Location>();
			lstLocation = locationService.Get().ToList();
			lstGarage = service.Get().ToList();
			ViewBag.locationList = lstLocation;
			ViewBag.garaList = lstGarage;
			return View("~/Areas/Provider/Views/Garage/GarageManagement.cshtml");
		}

		// Route to garage's detailed info page
		[Route("management/garageManagement/{id:int}")]
		public ViewResult GarageManagement(int id)
		{
            var service = this.Service<IGarageService>();
			Garage garage = service.Get(id);
			if (garage != null)
			{
				ViewBag.garaDetail = garage;
			}
			else
			{
				return View("errorNull");
			}
			return View("~/Areas/Provider/Views/Garage/GarageDetail.cshtml");
		}

		// API Route to get list of garage
		[Route("api/garages")]
		[HttpGet]
		public JsonResult GetGarageListAPI()
		{
            var service = this.Service<IGarageService>();
			//List<Garage> lstGarage = new List<Garage>();
			List<GarageModel> jsonGarages = new List<GarageModel>();
			//cho nay se get theo user
			jsonGarages = service.Get().ProjectTo<GarageModel>(this.MapperConfig).ToList();
			//foreach (Garage p in lstGarage)
			//{
			//	GarageModel jsonGarage = new GarageModel();
			//	jsonGarage.ID = p.ID;
			//	jsonGarage.Name = p.Name;
			//	jsonGarage.LocationID = p.LocationID;
			//	jsonGarage.LocationName = p.Location.Name;
			//	jsonGarage.Address = p.Address;
			//	jsonGarage.Star = p.Star.GetValueOrDefault();
			//	jsonGarage.IsActive = p.IsActive;
			//	jsonGarages.Add(jsonGarage);
			//}
			return Json(jsonGarages, JsonRequestBehavior.AllowGet);
		}

		// API Route to create single new garage
        // garageViewModel
		[Route("api/garages")]
		[HttpPost]
		public async Task<JsonResult> CreateGarageAPI(Garage model)
		{
            MessageJsonModel jsonResult = new MessageJsonModel();
            if (!this.ModelState.IsValid)
            {
                jsonResult.Status = 0;
                jsonResult.Message = "Creare failed!";
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }

            var service = this.Service<IGarageService>();

            Garage newGarage = this.Mapper.Map<Garage>(model);

            /*string OwnerID = Request.Params["UserID"];
			string Name = Request.Params["garageName"];
			int LocationID = int.Parse(Request.Params["locationID"]);
			string Address = Request.Params["address"];
			string Email = Request.Params["email"];
			String Phone1 = Request.Params["phone1"];
			String Phone2 = Request.Params["phone2"];
			DateTime openTimeMon = setDayFromParam(Request.Params["openTimeMon"]);
			DateTime closeTimeMon = setDayFromParam(Request.Params["closeTimeMon"]);
			DateTime openTimeTue = setDayFromParam(Request.Params["openTimeTue"]);
			DateTime closeTimeTue = setDayFromParam(Request.Params["closeTimeTue"]);
			DateTime openTimeWed = setDayFromParam(Request.Params["openTimeWed"]);
			DateTime closeTimeWed = setDayFromParam(Request.Params["closeTimeWed"]);
			DateTime openTimeThur = setDayFromParam(Request.Params["openTimeThur"]);
			DateTime closeTimeThur = setDayFromParam(Request.Params["closeTimeThur"]);
			DateTime openTimeFri = setDayFromParam(Request.Params["openTimeFri"]);
			DateTime closeTimeFri = setDayFromParam(Request.Params["closeTimeFri"]);
			DateTime openTimeSat = setDayFromParam(Request.Params["openTimeSat"]);
			DateTime closeTimeSat = setDayFromParam(Request.Params["closeTimeSat"]);
			DateTime openTimeSun = setDayFromParam(Request.Params["openTimeSun"]);
			DateTime closeTimeSun = setDayFromParam(Request.Params["closeTimeSun"]);

			Garage newGarage = new Garage();
			newGarage.OwnerID = OwnerID;
			newGarage.Name = Name;
			newGarage.LocationID = LocationID;
			newGarage.Address = Address;
			newGarage.Email = Email;
			newGarage.Phone1 = Phone1;
			newGarage.Phone2 = Phone2;
			newGarage.Star = 0;
			newGarage.IsActive = true;
			newGarage.OpenTimeMon = openTimeMon;
			newGarage.OpenTimeTue = openTimeTue;
			newGarage.OpenTImeWed = openTimeWed;
			newGarage.OpenTimeThur = openTimeThur;
			newGarage.OpenTimeFri = openTimeFri;
			newGarage.OpenTimeSat = openTimeFri;
			newGarage.OpenTimeSun = openTimeSun;
			newGarage.CloseTimeMon = closeTimeMon;
			newGarage.CloseTimeTue = closeTimeTue;
			newGarage.CloseTImeWed = closeTimeWed;
			newGarage.CloseTimeThur = closeTimeThur;
			newGarage.CloseTimeFri = closeTimeFri;
			newGarage.CloseTimeSat = closeTimeSat;
			newGarage.CloseTimeSun = closeTimeSun;*/

            await service.CreateAsync(newGarage);

            jsonResult.Status = 1;
            jsonResult.Message = "Create successfully!";
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

		// API Route to edit single garage
        // GarageViewModel
		[Route("api/garages")]
		[HttpPatch]
		public async Task<JsonResult> EditGarageAPI(Garage model)
		{
            MessageJsonModel jsonResult = new MessageJsonModel();
            if (!this.ModelState.IsValid)
            {
                jsonResult.Status = 0;
                jsonResult.Message = "Update failed!";
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }

            var service = this.Service<IGarageService>();
            var entity = await service.GetAsync(model?.ID);
            if(entity == null)
            {
                jsonResult.Status = 0;
                jsonResult.Message = "Update failed!";
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }

            this.Mapper.Map(model, entity);

			/*int ID = int.Parse(Request.Params["garageID"]);
			string Name = Request.Params["garageName"];
			int LocationID = int.Parse(Request.Params["locationID"]);
			string Address = Request.Params["address"];
			string Email = Request.Params["email"];
			String Phone1 = Request.Params["phone1"];
			String Phone2 = Request.Params["phone2"];
			DateTime openTimeMon = setDayFromParam(Request.Params["openTimeMon"]);
			DateTime closeTimeMon = setDayFromParam(Request.Params["closeTimeMon"]);
			DateTime openTimeTue = setDayFromParam(Request.Params["openTimeTue"]);
			DateTime closeTimeTue = setDayFromParam(Request.Params["closeTimeTue"]);
			DateTime openTimeWed = setDayFromParam(Request.Params["openTimeWed"]);
			DateTime closeTimeWed = setDayFromParam(Request.Params["closeTimeWed"]);
			DateTime openTimeThur = setDayFromParam(Request.Params["openTimeThur"]);
			DateTime closeTimeThur = setDayFromParam(Request.Params["closeTimeThur"]);
			DateTime openTimeFri = setDayFromParam(Request.Params["openTimeFri"]);
			DateTime closeTimeFri = setDayFromParam(Request.Params["closeTimeFri"]);
			DateTime openTimeSat = setDayFromParam(Request.Params["openTimeSat"]);
			DateTime closeTimeSat = setDayFromParam(Request.Params["closeTimeSat"]);
			DateTime openTimeSun = setDayFromParam(Request.Params["openTimeSun"]);
			DateTime closeTimeSun = setDayFromParam(Request.Params["closeTimeSun"]);

			Garage editGarage = service.findByID(ID);
			editGarage.Name = Name;
			editGarage.LocationID = LocationID;
			editGarage.Address = Address;
			editGarage.Email = Email;
			editGarage.Phone1 = Phone1;
			editGarage.Phone2 = Phone2;
			editGarage.OpenTimeMon = openTimeMon;
			editGarage.OpenTimeTue = openTimeTue;
			editGarage.OpenTImeWed = openTimeWed;
			editGarage.OpenTimeThur = openTimeThur;
			editGarage.OpenTimeFri = openTimeFri;
			editGarage.OpenTimeSat = openTimeFri;
			editGarage.OpenTimeSun = openTimeSun;
			editGarage.CloseTimeMon = closeTimeMon;
			editGarage.CloseTimeTue = closeTimeTue;
			editGarage.CloseTImeWed = closeTimeWed;
			editGarage.CloseTimeThur = closeTimeThur;
			editGarage.CloseTimeFri = closeTimeFri;
			editGarage.CloseTimeSat = closeTimeSat;
			editGarage.CloseTimeSun = closeTimeSun;*/

            await service.UpdateAsync(entity);

			jsonResult.Status = 0;
			jsonResult.Message = "Update failed!";
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

		// API Route to delete single garage
		[Route("api/garages/{id:int}")]
		[HttpDelete]
		public async Task<JsonResult> DeleteGarageAPI(int id)
		{
            var service = this.Service<IGarageService>();
			MessageJsonModel jsonResult = new MessageJsonModel();
            var entity = await service.GetAsync(id);
            if(entity != null)
			{
                await service.DeleteAsync(entity);
				jsonResult.Status = 1;
				jsonResult.Message = "Deleted successfully!";
			}
			else
			{
				jsonResult.Status = 0;
				jsonResult.Message = "Error!";
			}
			return Json(jsonResult, JsonRequestBehavior.AllowGet);
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