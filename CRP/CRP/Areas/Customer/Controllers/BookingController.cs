using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using CRP.Models.JsonModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Customer.Controllers
{
	public class BookingController : Controller
	{
        BookingService _service = new BookingService();
		// Route to bookingConfirm page (Page for confirming booking details before paying)
		[Route("bookingConfirm")]
		public ViewResult BookingConfirm()
		{
            //dau moa chua ro xu ly sao, chua lam
            int CustomerID = int.Parse(Request.Params["UserID"]);
            int VehicleID = int.Parse(Request.Params["VehicleID"]);
            //can 1 api de xu ly ca totalprice
            float TotalPrice = float.Parse(Request.Params["TotalPrice"]);
            float BookingFee = float.Parse(Request.Params["BookingFee"]);
            string VehicleName = Request.Params["VehicleName"];
            string GarageName = Request.Params["GarageName"];
            string GarageAddress = Request.Params["GarageAddress"];
            //can 1 cai datetimeformat
            DateTime StartTime = DateTime.Parse(Request.Params["StartTime"]);
            DateTime EndTime = DateTime.Parse(Request.Params["EndTime"]);
            //van de o cho la lam sao 2 thang hien confirm cung luc, nhung thoi gian booking khac nhau thi van dc booking
            return View("~/Areas/CuopenTimeMonstomer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingReceipt page (Redirect from NganLuong/BaoKim after customer has payed)
		[Route("bookingReceipt")]
		public ViewResult BookingReceipt()
		{
            //lay thong tin booking moi nhat cua thang user
            int CustomerID = 1;
            BookingReceipt lastBooking = _service.getLastBooking(CustomerID);
            //khi addBooking thi xuat ra ID
            // thieu api addBooking
            ViewBag.BookingReceipt = lastBooking;
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingHistory page
		[Route("management/bookingHistory")]
		public ViewResult BookingHistory()
		{
            //
            //Lay ID cua thang User hien hanh
            int userID = 1;
            //lay tat booking cua thang User hien hanh
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            lstBooking = _service.getByUser(userID);
            ViewBag.BookingList = lstBooking;
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

        // API route for getting this user's booking receipts
        // Pagination needed
        // Order by startTime, from newer to older
        [Route("api/bookings/{page:int?}")]
        [HttpGet]
        public JsonResult GetBookingReceiptAPI(int page = 1)
        {
            //lay id user
            int customerID = 1;
            //set cung 10 record la 1 page
            int numberPage = (int) Math.Ceiling((_service.getNumberPage(customerID))/10.0);
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            List<BookingReceiptModel> jsonBookings = new List<BookingReceiptModel>();
            //lay theo so record
            lstBooking = _service.getBookingOfUserWithRecord(customerID, page);
            foreach (BookingReceipt p in lstBooking)
            {
                BookingReceiptModel jsonBooking = new BookingReceiptModel();
                jsonBooking.ID = p.ID;
                jsonBooking.VehicleID = (int) p.VehicleID;
                jsonBooking.VehicleName = p.VehicleName;
                jsonBooking.BookingFee = p.BookingFee;
                jsonBooking.CustomerID = p.CustomerID;
                jsonBooking.Comment = p.Comment;
                jsonBooking.GarageAddress = p.GarageAddress;
                jsonBooking.GarageName = p.GarageName;
                jsonBooking.IsCanceled = p.IsCanceled;
                jsonBooking.Star = p.Star.GetValueOrDefault();
                jsonBooking.TotalPrice = p.TotalPrice;
                jsonBooking.StartTime = p.StartTime;
                jsonBooking.EndTime = p.EndTime;
                jsonBooking.numberPage = numberPage;
                jsonBookings.Add(jsonBooking);
            }
            return Json(jsonBookings, JsonRequestBehavior.AllowGet);
        }

        // API route for getting booking calendar of this vehicle
        // Only get bookingReceipt of the next 30 days from this moment
        [Route("api/bookings/calendar/{vehicleID:int}")]
		[HttpGet]
		public JsonResult GetBookingCalendarAPI(int vehicleID)
		{
            List<BookingReceipt> booking = _service.findByVehicle(vehicleID);
            List<VehicleCalendarModel> jsonBookings = new List<VehicleCalendarModel>();
            foreach (BookingReceipt p in booking)
            {
                VehicleCalendarModel jsonBooking = new VehicleCalendarModel();
                jsonBooking.ID = p.ID;
                jsonBooking.StartTime = p.StartTime;
                jsonBooking.EndTime = p.EndTime;
                jsonBookings.Add(jsonBooking);
            }
            return Json(jsonBookings, JsonRequestBehavior.AllowGet);
		}

		// API route for canceling a booking
		[Route("api/bookings/{id:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int id)
		{
            MessageJsonModel jsonResult = new MessageJsonModel();
            Boolean result = _service.cancleBooking(id);
            if (result)
            {
                jsonResult.Status = 1;
                jsonResult.Message = "Cancle successfully!";
            }
            else
            {
                jsonResult.Status = 0;
                jsonResult.Message = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

		// API route for sending comment/rating for a booking
		[Route("api/bookings/{id:int}")]
		[HttpPut]
		public JsonResult RateBookingAPI(int id)
		{
			//comment xong co can cancle va set dateend lun ko?
			MessageJsonModel jsonResult = new MessageJsonModel();
            string comment = Request.Params["comment"];
            //cach tinh star cho vehicle hay cho Provider?
            decimal Star = decimal.Parse(Request.Params["star"]);
            BookingReceipt booking = _service.findByID(id);
            booking.Comment = comment;
            booking.Star = Star;
            Boolean result = _service.rateForBooking(booking);
            if (result)
            {
                jsonResult.Status = 1;
                jsonResult.Message = "Rate successfully!";
            }
            else
            {
                jsonResult.Status = 0;
                jsonResult.Message = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
	}
}