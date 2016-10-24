using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Repositories;
using CRP.Models.Entities.Services;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Admin.Controllers
{
	public class UserManagementController : BaseController
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

        // API Route to get list of garage
        [Route("api/UserManagement")]
        [HttpGet]
        public JsonResult GetGarageListAPI()
        {
            String customerID = User.Identity.GetUserId();
            var service = this.Service<IUserReceiptService>();
            List<AspNetUser> list = service.Get().ToList();
            var result = list.Select(q => new IConvertible[] {
                q.Id,
                q.UserName,
                q.FullName,
                q.Email,
                q.PhoneNumber,
                q.IsProviderUntil,
                q.LockoutEnabled,
                q.LockoutEndDateUtc
            });
            return Json(new { aaData = result }, JsonRequestBehavior.AllowGet);
        }
    }
}