using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities.Services;
using CRP.Models.ViewModels;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Provider.Controllers
{
    public class BookingController : BaseController
    {
        // Route to vehicleManagement page
        [Authorize(Roles = "Provider")]
        [Route("management/BookingManagement")]
        public ViewResult BookingManagement()
        {
            var service = this.Service<IGarageService>();
            GarageView garageView = new GarageView();
            var providerID = User.Identity.GetUserId();
            garageView.listGarage = service.Get()
                .Where(q => q.OwnerID == providerID)
                .Select(q => new SelectListItem()
                {
                    Text = q.Name,
                    Value = q.ID.ToString(),
                    Selected = true,
                });
            return View("~/Areas/Provider/Views/Booking/BookingManagement.cshtml", garageView);
        }

        public JsonResult GetListBooking()
        {
            return Json("");
        }
    }
}