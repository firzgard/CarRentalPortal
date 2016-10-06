using CRP.Models.Entities.Services;
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

			return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingReceipt page (Redirect from NganLuong/BaoKim after customer has payed)
		[Route("bookingReceipt")]
		public ViewResult BookingReceipt()
		{
			return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingHistory page
		[Route("management/bookingHistory")]
		public ViewResult BookingHistory()
		{
			return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// API route for getting booking calendar of this vehicle
		// Only get bookingReceipt of the next 30 days from this moment
		[Route("api/bookings/{vehicleID:int}")]
		[HttpGet]
		public JsonResult GetBookingCalendarAPI(int vehicleID)
		{
			return Json("");
		}

		// API route for canceling a booking
		[Route("api/bookings/{id:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int id)
		{
			return Json("");
		}

		// API route for sending comment/rating for a booking
		[Route("api/bookings/{id:int}")]
		[HttpPut]
		public JsonResult RateBookingAPI(int id)
		{
			return Json("");
		}
	}
}