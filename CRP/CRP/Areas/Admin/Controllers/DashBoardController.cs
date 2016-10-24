using CRP.Controllers;
using CRP.Models.ViewModels;
using CRP.Models.Entities;
using CRP.Models.Entities.Repositories;
using CRP.Models.Entities.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CRP.Models;

namespace CRP.Areas.Admin.Controllers
{
    public class DashBoardController : BaseController
    {
        // GET: Admin/DashBoard
        public ActionResult Index()
        {
            ReportViewModel viewModel = new ReportViewModel();
            var serviceBooking = this.Service<IBookingReceiptService>();
            var serviceCar = this.Service<IVehicleService>();
            var serviceUser = this.Service<IUserReceiptService>();
            var serviceRole = this.Service<IRoleService>();
            AspNetRole provider = serviceRole.Get("2");
            viewModel.booking = serviceBooking.Get(q => q.IsPending == false).ToList().Count();
            var bookSuccess = serviceBooking.Get(q => q.IsCanceled == false && q.IsPending == false).ToList().Count();
            viewModel.bookingSuccess = bookSuccess;
            viewModel.booking = serviceCar.Get().ToList().Count();
            DateTime today = DateTime.Now;
            //tinh co bookingfee co dinh hay 5%
            viewModel.money = bookSuccess * 10000;
            viewModel.provider = serviceUser.Get(q => q.AspNetRoles.Contains(provider)).ToList().Count();
            viewModel.providerActive = serviceUser.Get(q => q.AspNetRoles.Contains(provider) && q.IsProviderUntil > today).ToList().Count();
    

            return View(viewModel);
        }
    }
}