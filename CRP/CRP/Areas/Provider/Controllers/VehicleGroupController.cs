using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{
	public class VehicleGroupController : Controller
	{
		[Route("management/vehicleGroupManagement")]
		public ViewResult VehicleGroupManagement()
		{
			return View("~/Areas/Provider/Views/VehicleGroup/VehicleGroupManagement.cshtml");
		}
	}
}