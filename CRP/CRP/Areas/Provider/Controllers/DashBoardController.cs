using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
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
    public class DashBoardController : BaseController
    {
        // GET: Provider/DashBoard
        [Route("DashBoard/provider")]
        public ActionResult Index()
        {
            DateTime day = DateTime.Now;
            DateTime fromDay = new DateTime();
            fromDay = day.AddMonths(-(day.Month));
            DateTime toDay = new DateTime();
            var providerID = User.Identity.GetUserId();
            var GarageService = this.Service<IGarageService>();
            var CarService = this.Service<IVehicleService>();
            var BookingService = this.Service<IBookingReceiptService>();
            var UserService = this.Service<IUserService>();
            AspNetUser UserEntity = UserService.Get(q => q.Id == providerID).FirstOrDefault();
            var listGara = GarageService.Get(q => q.OwnerID == providerID).ToList();
            var listComment = new List<CommentModel>();
            var listBooking = new List<BookingReceipt>();
            var comment = new CommentModel();
            ProviderReportViewModel model = new ProviderReportViewModel();
            model.ID = providerID;
            model.ProviderName = UserEntity.UserName;
            listBooking = BookingService.Get(q => q.AspNetUser1.Id == providerID && q.IsSelfBooking == false && q.IsCanceled == false &&
                q.IsPending == false).ToList();
            foreach (BookingReceipt item in listBooking)
            {
                model.money = model.money + item.RentalPrice;
                model.booking = + 1;
            }
            listBooking = BookingService.Get(q => q.AspNetUser1.Id == providerID && q.IsSelfBooking == false &&
               q.IsPending == false).OrderByDescending(q => q.ID).Take(3).ToList();
            foreach (BookingReceipt item3 in listBooking)
            {
                comment.UserName = item3.AspNetUser.UserName;
                comment.Comment = item3.Comment;
                comment.star = item3.Star.GetValueOrDefault();
                listComment.Add(comment);
            }
            model.car = CarService.Get(q => q.Garage.AspNetUser.Id == providerID).ToList().Count();
            model.providerUtil = UserEntity.IsProviderUntil.ToString();
            model.comment = listComment;
            //lay data cho chart
            ReportBookingInYear chart = new ReportBookingInYear();
            chart.month1 = 12;
            chart.month2 = 9;
            chart.month3 = 12;
            chart.month4 = 12;
            chart.month5 = 17;
            chart.month6 = 13;
            chart.month7 = 19;
            chart.month8 = 13;
            chart.month9 = 12;
            chart.month10 = 8;
            chart.month11 = 11;
            chart.month12 = 13;
            //for (int i =1; i<=12; i++)
            //{

            //    chart.month = i;
            //    chart.booking = i * 10;
            //    ////code khi co data
            //    //toDay = fromDay.AddMonths(1);
            //    //chart.booking = BookingService.Get(q => q.AspNetUser1.Id == providerID && q.IsSelfBooking == false &&
            //    //    q.IsPending == false && q.IsCanceled == false && q.EndTime >= fromDay && q.EndTime <= toDay).ToList().Count();
            //    //fromDay = toDay;
            //    listBookingInY.Add(chart);
            //}
            ViewBag.brandList = chart;
            return View("~/Areas/Provider/Views/DashBoard/Index.cshtml", model);
        }
        //test
        [Route("api/getProviderData1")]
        [HttpGet]
        public ActionResult GetTestData()
        {
            DateTime today = DateTime.Now;
            var providerID = User.Identity.GetUserId();
            var BookingService = this.Service<IBookingReceiptService>();
            var listBooking = new List<BookingReceipt>();
            var listReportMoney = new List<ReportMoneyViewModel>();
            var period = 0;
            for (int i =1; i <= today.Month; i++)
            {
                period = today.Month - i;
                ReportMoneyViewModel model = new ReportMoneyViewModel();
                YearMonthModel Time = new YearMonthModel();
                Time.Month = i;
                Time.Year = today.Year;
                model.Time = Time;
                model.Money = period * 10010;
                //test
                //listBooking = BookingService.Get(q => q.EndTime < today.AddMonths(-period)).ToList();
                listReportMoney.Add(model);
            }
            return Json(new { aaData = listReportMoney }, JsonRequestBehavior.AllowGet);
        }
    }
}