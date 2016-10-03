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
		[Route("api/vehicles/{id}")]
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult Random()
		{
			var vehicle = new Vehicle() { Name = "BWM X7" };

			return View();
		}
	}
}