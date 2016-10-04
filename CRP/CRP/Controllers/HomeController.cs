﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Controllers
{
	public class HomeController : Controller
	{
		// Route to homepage
		public ActionResult Index()
		{
			return View();
		}

		// Route to vehicle search results
		[Route("search")]
		public ActionResult Search()
		{
			return View();
		}

		// Route to vehicle's info
		[Route("vehicleInfo/{id:int}")]
		public ActionResult VehicleInfo(int id)
		{
			return View();
		}
	}
}