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
            return View("~/Areas/CuopenTimeMonstomer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingReceipt page (Redirect from NganLuong/BaoKim after customer has payed)
		[Route("bookingReceipt")]
		public ViewResult BookingReceipt()
		{
            //lay thong tin booking moi nhat cua thang user
            int CustomerID = int.Parse(Request.Params["UserID"]);
            BookingReceipt lastBooking = _service.getLastBooking(CustomerID);
            //khi addBooking thi xuat ra ID
            // thieu api addBooking
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingHistory page
		[Route("management/bookingHistory")]
		public ViewResult BookingHistory()
		{
            //Lay ID cua thang User hien hanh
            int userID = 1;
            //lay booking cua thang User hien hanh
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            lstBooking = _service.getByUser(userID);
            ViewBag.BookingList = lstBooking;
            return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// API route for getting booking calendar of this vehicle
		// Only get bookingReceipt of the next 30 days from this moment
		[Route("api/bookings/{vehicleID:int}")]
		[HttpGet]
		public JsonResult GetBookingCalendarAPI(int vehicleID)
		{
            List<BookingReceipt> booking = _service.findByVehicle(vehicleID);
            //cho nay can lay ra json la cai j, ngay thang nam ha
			return Json("");
		}

		// API route for canceling a booking
		[Route("api/bookings/{id:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int id)
		{
            MessageViewModels jsonResult = new MessageViewModels();
            Boolean result = _service.cancleBooking(id);
            if (result)
            {
                jsonResult.StatusCode = 1;
                jsonResult.Msg = "Deleted successfully!";
            }
            else
            {
                jsonResult.StatusCode = 0;
                jsonResult.Msg = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
		}

		// API route for sending comment/rating for a booking
		[Route("api/bookings/{id:int}")]
		[HttpPut]
		public JsonResult RateBookingAPI(int id)
		{
            //comment xong co can cancle va set dateend lun ko?
            MessageViewModels jsonResult = new MessageViewModels();
            string comment = Request.Params["comment"];
            Decimal Star = Decimal.Parse(Request.Params["star"]);
            BookingReceipt booking = _service.findByID(id);
            Boolean result = _service.rateForBooking(booking);
            if (result)
            {
                jsonResult.StatusCode = 1;
                jsonResult.Msg = "Deleted successfully!";
            }
            else
            {
                jsonResult.StatusCode = 0;
                jsonResult.Msg = "Error!";
            }
            return Json(jsonResult, JsonRequestBehavior.AllowGet);
        }
	}
}