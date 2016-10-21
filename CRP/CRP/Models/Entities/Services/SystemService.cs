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
        public void SendMailBooking(string toEmail, BookingReceipt booking)
        {
            String bodyEmail = "";
            DateTime today = DateTime.Now;
            MailMessage mailMessage = new MailMessage("tamntse61384@fpt.edu.vn", toEmail);
            mailMessage.Subject = "Thông tin booking " + " " + booking.Vehicle.Name;
            bodyEmail = "Bạn vừa có booking vào " + today.ToString() + "\n Thông tin Booking như sau: " + "\n Tên xe: "
                + booking.VehicleName + "\n Người thuê: " + booking.AspNetUser.UserName + "\n Số điện thoại: " + booking.AspNetUser.PhoneNumber +
                "\n Nhà cung cấp: " + booking.AspNetUser11.UserName + "\n Số điện thoại:" + booking.AspNetUser11.PhoneNumber + "\n Địa chỉ: " +
                booking.GarageAddress + "\n Xin hai bên vui lòng liên hệ trực tiếp với nhau để nhận xe!";
            mailMessage.Body = bodyEmail;

            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.Credentials = new System.Net.NetworkCredential()
            {
                UserName = "tamntse61384@fpt.edu.vn",
                Password = "0975420837"
            };
            smtpClient.EnableSsl = true;
            smtpClient.Send(mailMessage);
        }
        //gui mail thong bao provider
        public void SendMailBecomeProvider(string toEmail, AspNetUser user)
        {
            String bodyEmail = "";
            DateTime today = DateTime.Now;
            MailMessage mailMessage = new MailMessage("tamntse61384@fpt.edu.vn", toEmail);
            mailMessage.Subject = "Thông tin về thời hạn cho thuê xe trên CRP";
            bodyEmail = "Cám ơn bạn đã sử dụng dịch vụ của chúng tôi trong suốt thời gian qua! \n Thông tin tài khoản của bạn như sau"
                + "\n Tên:" + user.UserName + "\n Email:" + user.Email + "\n Bạn là provider đến:" + user.IsProviderUntil.ToString();
            mailMessage.Body = bodyEmail;
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.Credentials = new System.Net.NetworkCredential()
            {
                UserName = "tamntse61384@fpt.edu.vn",
                Password = "0975420837"
            };
            smtpClient.EnableSsl = true;
            smtpClient.Send(mailMessage);
        }
        //gui mail khi bi admin BAN
        public void SendMailBanUser(AspNetUser user)
        {
            String bodyEmail = "";
            DateTime today = DateTime.Now;
            MailMessage mailMessage = new MailMessage("tamntse61384@fpt.edu.vn", user.Email);
            mailMessage.Subject = "Thông tin về thời hạn cho thuê xe trên CRP";
            bodyEmail = "Cám ơn bạn đã sử dụng dịch vụ của chúng tôi trong suốt thời gian qua! \n Thông tin tài khoản của bạn như sau"
                + "\n Tên:" + user.UserName + "\n Email:" + user.Email + "\n Nhưng rất tiếc vì một vài sự cố và lý do nào đó, tài khoảng của bạn"
                +"đã bị khóa!";
            mailMessage.Body = bodyEmail;
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
            smtpClient.Credentials = new System.Net.NetworkCredential()
            {
                UserName = "tamntse61384@fpt.edu.vn",
                Password = "0975420837"
            };
            smtpClient.EnableSsl = true;
            smtpClient.Send(mailMessage);
        }
        public void UpdateRatingGarage(int garageID)
        {
            decimal newRating = 0;
            decimal sum = 0;
            var garaService = this.Service<IGarageService>();
            var BookingService = this.Service<IBookingReceiptService>();
            List<BookingReceipt> lisBook = BookingService.Get(q => q.GarageID == garageID).ToList();
            foreach (BookingReceipt item in lisBook.ToList())
            { 
                if (item.IsSelfBooking == true)
                {
                    lisBook.Remove(item);
                }
            }
            //List <BookingReceipt> lisBook1 = BookingService.GetBookingReceiptWithGarage(garageID);
            foreach (BookingReceipt item in lisBook)
            {
                sum = sum + item.Star.GetValueOrDefault();
            }
            newRating = sum / lisBook.Count();
            Garage garage = garaService.Get(garageID);
            garage.Star = newRating;
            garaService.Update(garage);
        }

        public void UpdateRatingVehicle(int vehicleId)
        {
            decimal newRating = 0;
            decimal sum = 0;
            var VehicleService = this.Service<IVehicleService>();
            var BookingService = this.Service<IBookingReceiptService>();
            List<BookingReceipt> lisBook = BookingService.Get(q => q.VehicleID == vehicleId).ToList();
            foreach (BookingReceipt item in lisBook.ToList())
            {
                if (item.IsSelfBooking == true)
                {
                    lisBook.Remove(item);
                }
            }
            //List <BookingReceipt> lisBook1 = BookingService.GetBookingReceiptWithGarage(garageID);
            foreach (BookingReceipt item in lisBook)
            {
                sum = sum + item.Star.GetValueOrDefault();
            }
            newRating = sum / lisBook.Count();
            Vehicle garage = VehicleService.Get(vehicleId);
            garage.Star = newRating;
            VehicleService.Update(garage);
        }
    }
}