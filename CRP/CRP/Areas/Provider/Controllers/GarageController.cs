using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;

namespace CRP.Areas.Provider.Controllers
{
	public class GarageController : Controller
	{
		// GET: api/garageList
		public ViewResult APIGarageList()
		{
			return this.View();
		}
	}
}