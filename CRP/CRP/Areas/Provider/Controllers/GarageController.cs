using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.Entities;

namespace CRP.Areas.Provider.Controllers
{
	public class GarageController : Controller
	{
		GarageService service = new GarageService();

		[Route("management/garageManagement")]
		public ViewResult GarageManagement()
		{
			return View("~/Areas/Provider/Views/Garage/GarageManagement.cshtml");
		}

		// GET: Brand
		public ActionResult Index()
		{
			List<Garage> lstGara = new List<Garage>();
			lstGara = service.getAll();
			ViewBag.garaList = lstGara;
			return View();
		}
		// POST: Provider/CarBrand/Delete/5
		[HttpPost]
		public String Delete()
		{
			int ID = int.Parse(Request.Params["id"]);
			if (service.delete(ID))
			{
				return "true";
			}
			return "false";
		}
	}
}