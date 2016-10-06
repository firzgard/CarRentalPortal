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
        public Boolean cancleBooking (int id)
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
            List<BookingReceipt> lstBooking = _repository.getByVehicle(vehicleID);
            List<BookingReceipt> lstBookingDuring = new List<BookingReceipt>();
            foreach (BookingReceipt booking in lstBooking)
            {
                if(booking.IsCanceled == false)
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
    }
}