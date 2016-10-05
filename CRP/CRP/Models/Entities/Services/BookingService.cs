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
            lstBooking = _repository.getAllGarage();
            return lstBooking;
        }
        public List<BookingReceipt> findByUser(int UserID)
        {
            List<BookingReceipt> lstGarage = new List<BookingReceipt>();
            return lstGarage;
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
    }
}