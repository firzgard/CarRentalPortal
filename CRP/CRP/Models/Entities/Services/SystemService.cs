using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using CRP.Controllers;

namespace CRP.Models.Entities.Services
{
	public class SystemService : BaseController
	{
		//gui mail thong bao ve Booking moi
		public void SendBookingAlertEmailToCustomer(BookingReceipt booking)
		{
			var mailMessage = new MailMessage("siunhandiendien11@gmail.com", booking.AspNetUser.Email)
			{
				Subject = "Giao dịch đặt xe mới trên hệ thống CRP",
				Body = "Bạn vừa tiến hành đặt xe " + booking.VehicleName + " thành công trên hệ thống của chúng tôi.\nChúc bạn có một chuyến đi vui vẻ."
			};

			var smtpClient = new SmtpClient("smtp.gmail.com", 587)
			{
				Credentials = new System.Net.NetworkCredential()
				{
					UserName = "siunhandiendien11@gmail.com",
					Password = "0975420837"
				},
				EnableSsl = true
			};
			smtpClient.Send(mailMessage);
		}

		//gui mail thong bao ve Booking moi
		public void SendBookingAlertEmailToProvider(BookingReceipt booking)
		{
			var mailMessage = new MailMessage("siunhandiendien11@gmail.com", booking.Garage.Email)
			{
				Subject = "Giao dịch đặt xe mới trên hệ thống CRP",
				Body = "Xe " + booking.VehicleName + " của bạn vừa được đặt từ " + booking.StartTime.ToString(@"dd\/MM\/yyyy HH:mm") + " đến " + booking.EndTime.ToString(@"dd\/MM\/yyyy HH:mm") + " bởi khách hàng " + booking.AspNetUser.FullName + ".\n"
					+ "Bạn có thể liên hệ với khách hàng qua email <a href=\"mailto:" + booking.AspNetUser.Email + "\">" + booking.AspNetUser.Email + "</a> hoặc qua số điện thoại <a href=\"tel:" + booking.AspNetUser.PhoneNumber + "\">" + booking.AspNetUser.PhoneNumber + "</a>."
			};

			var smtpClient = new SmtpClient("smtp.gmail.com", 587)
			{
				Credentials = new System.Net.NetworkCredential()
				{
					UserName = "siunhandiendien11@gmail.com",
					Password = "0975420837"
				},
				EnableSsl = true
			};
			smtpClient.Send(mailMessage);
		}

		//gui mail thong bao provider
		public void SendBecomeProviderAlertEmail(string toEmail, AspNetUser user)
		{
			var mailMessage = new MailMessage("siunhandiendien11@gmail.com", toEmail)
			{
				Subject = "Giao dịch đăng ký quyền cung cấp trên hệ thống CRP",
				Body = "Giao dịch đăng ký quyền nhà cung cấp cho thuê xe trên hệ thống CRP của bạn đã thành công. Cảm ơn bạn đã chọn đồng hành cùng chúng tôi."
			};

			var smtpClient = new SmtpClient("smtp.gmail.com", 587)
			{
				Credentials = new System.Net.NetworkCredential()
				{
					UserName = "siunhandiendien11@gmail.com",
					Password = "0975420837"
				},
				EnableSsl = true
			};
			smtpClient.Send(mailMessage);
		}

		//gui mail khi bi admin BAN
		public void SendLockoutAlertEmail(AspNetUser user)
		{
			var mailMessage = new MailMessage("siunhandiendien11@gmail.com", user.Email)
			{
				Subject = "Tài khoản CRP của bạn đã bị khóa.",
				Body = "Tài khoản CRP với username " + user.UserName + " của bạn đã bị khóa. Nếu có vấn đề thắc mắc, vui lòng liên hệ trực tiếp với chúng tôi.\nXin cảm ơn."
			};

			var smtpClient = new SmtpClient("smtp.gmail.com", 587)
			{
				Credentials = new System.Net.NetworkCredential()
				{
					UserName = "siunhandiendien11@gmail.com",
					Password = "0975420837"
				},
				EnableSsl = true
			};
			smtpClient.Send(mailMessage);
		}

		// //gui mail khi bi dang ki
		public void SendRegistrationConfirmEmail(string userEmail, string callbackUrl)
		{
			var mailMessage = new MailMessage("siunhandiendien11@gmail.com", userEmail)
			{
				Subject = "Xác nhận đăng ký tài khoản CRP",
				Body = "Vui lòng xác nhận tài khoản CRP của bạn bằng cách click vào <a href=\"" + callbackUrl + "\">đây</a>."
			};

			var smtpClient = new SmtpClient("smtp.gmail.com", 587);
			smtpClient.Credentials = new System.Net.NetworkCredential()
			{
				UserName = "siunhandiendien11@gmail.com",
				Password = "0975420837"
			};
			smtpClient.EnableSsl = true;
			smtpClient.Send(mailMessage);
		}

		//gui mail lay lai password
		public void SendRecoverPasswordEmail(string userEmail, string callbackUrl)
		{
			var mailMessage = new MailMessage("siunhandiendien11@gmail.com", userEmail)
			{
				Subject = "Khôi phục mật khẩu tài khoản CRP.",
				Body = "Chúng tôi vừa nhận được yêu cầu khôi phục mật khẩu cho tài khoản đăng ký với email này. Để khôi phục mật khẩu, vui lòng click vào <a href=\"" + callbackUrl + "\">đây</a>."
			};

			var smtpClient = new SmtpClient("smtp.gmail.com", 587)
			{
				Credentials = new System.Net.NetworkCredential()
				{
					UserName = "siunhandiendien11@gmail.com",
					Password = "0975420837"
				},
				EnableSsl = true
			};
			smtpClient.Send(mailMessage);
		}
	}
}