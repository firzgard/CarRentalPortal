using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Customer.Controllers
{
	public class BookingController : Controller
	{
		// Route to bookingConfirm page (Page for confirming booking details before paying)
		[Route("management/bookingConfirm")]
		public ViewResult BookingConfirm()
		{
			return View("~/Areas/Customer/Views/Booking/BookingHistory.cshtml");
		}

		// Route to bookingReceipt page (Redirect from NganLuong/BaoKim after customer has payed)
		[Route("management/bookingReceipt")]
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

		// API route for canceling a booking
		[Route("api/bookings/{id:int}")]
		[HttpDelete]
		public JsonResult CancelBookingAPI(int id)
		{
			return Json("");
		}

		// API route for sending comment/rating for a booking
		[Route("api/booking/{id:int}")]
		[HttpPatch]
		public JsonResult RateBookingAPI(int id)
		{
			return Json("");
		}
	}
}