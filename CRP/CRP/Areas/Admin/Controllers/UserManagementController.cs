using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Admin.Controllers
{
	public class UserManagementController : Controller
	{
		// Route to userManagement page
		[Route("management/userManagement")]
		public ViewResult UserManagement()
		{
			return View("~/Areas/Admin/Views/User/UserManagement.cshtml");
		}

		// API route for toggling isActive (Deactivate/Reactivate) of an account
		[Route("api/user/toggleIsActive/{id:int}")]
		[HttpPatch]
		public JsonResult ToogleIsActiveAPI(int id)
		{
			return Json("");
		}
	}
}