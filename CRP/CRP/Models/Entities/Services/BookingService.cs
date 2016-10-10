using CRP.Models.Entities.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.Entities.Services
{
    public class BookingService
    {
        BookingRepository _repository = new BookingRepository();
        public Boolean add(BookingReceipt booking)
        {
            try
            {
                _repository.Add(booking);
            }
            catch (Exception e)
            {
                e.GetHashCode();
                return false;
            }
            return true;
        }
        public int addwithPending(BookingReceipt booking)
        {
            int BookingId = 0;
            try
            {
                _repository.Add(booking);
                BookingReceipt lastbooking = _repository.getLastBooking(booking.CustomerID);
                BookingId = lastbooking.ID;
            }
            catch (Exception e)
            {
                e.GetHashCode();
                return BookingId;
            }
            return BookingId;
        }

        public Boolean delete(int ID)
        {
            BookingReceipt deleteBooking = _repository.findById(ID);
            if (deleteBooking == null)
            {
                return false;
            }
            else
            {
                try
                {
                    _repository.Delete(deleteBooking);
                }
                catch (Exception e)
                {
                    e.GetHashCode();
                    return false;
                }
                return true;
            }
        }
        public Boolean IsPending(int BookingID)
        {
            BookingReceipt booking = _repository.findById(BookingID);
            if (booking.IsPending == true)
            {
                return true;
            }
            return false;
        }
        public List<BookingReceipt> getAll()
        {
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            lstBooking = _repository.getAll();
            return lstBooking;
        }
        public List<BookingReceipt> findByUser(int UserID)
        {
            List<BookingReceipt> lstBooking = new List<BookingReceipt>();
            return lstBooking;
        }
        public BookingReceipt findByID(int id)
        {
            BookingReceipt booking = _repository.findById(id);
            return booking;
        }

        public Boolean Update(BookingReceipt booking)
        {
            try
            {
                _repository.Update(booking);
            }
            catch (Exception e)
            {
                e.GetHashCode();
                return false;
            }

            return true;
        }

        // Check to see if the vehicle is available
        public Boolean CheckVehicleAvailability(int vehicleID, DateTime startTime, DateTime endTime)
        {
            List<BookingReceipt> bookingReceiptList = _repository.findBookingOfVehicleInPeriod(vehicleID, startTime, endTime);
            return bookingReceiptList.Count() == 0;
        }
        public List<BookingReceipt> getByUser(int UserID)
        {
            List<BookingReceipt> lstBooking = _repository.getByUser(UserID);
            return lstBooking;
        }
        public List<BookingReceipt> getBookingOfUserWithRecord(int customerID, int record)
        {
            List<BookingReceipt> lstBooking = _repository.getBookingOfUserWithRecord(customerID, record);
            return lstBooking;
        }
        public int getNumberPage(int CustomerID)
        {
            int numberPage = _repository.getNumberPage(CustomerID);
            return numberPage;
        }
        public Boolean cancleBooking(int id)
        {
            BookingReceipt cancleBooking = _repository.findById(id);
            cancleBooking.IsCanceled = true;
            try
            {
                _repository.Update(cancleBooking);
            }
            catch (Exception e)
            {
                e.GetHashCode();
                return false;
            }

            return true;

        }
        public Boolean rateForBooking(BookingReceipt booking)
        {
            try
            {
                _repository.Update(booking);
            }
            catch (Exception e)
            {
                e.GetHashCode();
                return false;
            }

            return true;
        }
        public List<BookingReceipt> findByVehicle(int vehicleID)
        {
            DateTime today = DateTime.Now;
            List<BookingReceipt> lstBooking = _repository.getByVehicle(vehicleID);
            List<BookingReceipt> lstBookingDuring = new List<BookingReceipt>();
            foreach (BookingReceipt booking in lstBooking)
            {
                if (compareDateBooking(booking.EndTime,today))
                {
                    lstBookingDuring.Add(booking);
                }
            }
            return lstBookingDuring;
        }
        //xoa
        public BookingReceipt getLastBooking(int customerID)
        {
            BookingReceipt lastBooking = _repository.getLastBooking(customerID);
            return lastBooking;
        }

        public Boolean compareDateBooking(DateTime date1, DateTime date2)
        {
            //date 1 la end day cua booking, date2 la now
            if (date1.Year > date2.Year)
            {
                return true;
            }
            else if (date1.Year < date2.Year)
            {
                return false;
            }
            else if (date1.Year == date2.Year)
            {
                if (date1.Month > date2.Month)
                {
                    return true;
                }
                else if (date1.Month < date2.Month)
                {
                    return false;
                }
                else if (date1.Month == date2.Month)
                {
                    if (date1.Day > date2.Day)
                    {
                        return true;
                    } else if (date1.Day < date2.Day)
                    {
                        return false;
                    } else if (date1.Day == date2.Day)
                    {
                        if (date1.Hour > date2.Hour)
                        {
                            return true;
                        } else if (date1.Hour < date2.Hour)
                        {
                            return false;
                        } else if (date1.Hour == date2.Hour)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
    }
}