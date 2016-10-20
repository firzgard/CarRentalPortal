using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models.Entities;

namespace CRP.Models.ViewModels
{
    public class BookingReceiptViewModel
    {
        public int ID { get; set; }

        public string CustomerID { get; set; }

        public double RentalPrice { get; set; }

        public double Deposit { get; set; }

        public double BookingFee { get; set; }

        public decimal Star { get; set; }
        public string Comment { get; set; }

        //validate start and end time
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public int VehicleID { get; set; }
        public string VehicleName { get; set; }
        public string GarageName { get; set; }
        public string GarageAddress { get; set; }
        public int ModelID { get; set; }
        public int Year { get; set; }
        public int TransmissionType { get; set; }
        public string TransmissionDetail { get; set; }
        public int FuelType { get; set; }
        public string Engine { get; set; }
        public int Color { get; set; }
        public bool IsCanceled { get; set; }
        public bool IsPending { get; set; }
    }

	public class BookingReceiptModel
	{
		public List<BookingReceipt> listReceipt { get; set; }
		public int numberPage { get; set; }

		public BookingReceiptModel()
		{
			listReceipt = new List<BookingReceipt>();
		}
	}

	public class BookingCommentModel
	{
		public int ID { get; set; }
		public decimal Star { get; set; }
		public string Comment { get; set; }
	}

    public class BookingsRecordJsonModel
    {
        public int ID { get; set; }
        public string CustomerName { get; set; }
        public string CustomertEmail { get; set; }
        public string CustomerPhone { get; set; }
        public int? VehicleID { get; set; }
        public string VehicleName { get; set; }
        public string LicenseNumber { get; set; }
        public double RentalPrice { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public decimal? Star { get; set; }
        public string Comment { get; set; }
        public bool IsInThePast { get; set; }
        public bool IsCanceled { get; set; }
        public bool IsSelfBooking { get; set; }
        public BookingsRecordJsonModel(BookingReceipt receipt)
        {
            ID = receipt.ID;
            CustomerName = receipt.AspNetUser.FullName;
            CustomertEmail = receipt.AspNetUser.Email;
            CustomerPhone = receipt.AspNetUser.PhoneNumber;
            VehicleID = receipt.VehicleID;
            VehicleName = receipt.VehicleName;
            LicenseNumber = receipt.LicenseNumber;
            RentalPrice = receipt.RentalPrice;
            StartTime = receipt.StartTime.ToShortTimeString() + " " + receipt.StartTime.ToShortDateString();
            EndTime = receipt.EndTime.ToShortTimeString() + " " +receipt.EndTime.ToShortDateString();
            Star = receipt.Star;
            Comment = receipt.Comment;

            DateTime now = DateTime.Now;
            if(receipt.StartTime < now)
            {
                IsInThePast = true;
            } else
            {
                IsInThePast = false;
            }

            IsCanceled = receipt.IsCanceled;
            IsSelfBooking = receipt.IsSelfBooking;
        }
    }

    public class BookingsDataTablesJsonModel
    {
        public List<BookingsRecordJsonModel> data { get; set; }
        public int draw { get; set; }
        public int recordsTotal { get; set; }
        public int recordsFiltered { get; set; }

        public BookingsDataTablesJsonModel(List<BookingsRecordJsonModel> bookingList, int rDraw, int totalRecords, int FilteredRecords)
        {
            data = bookingList;
            draw = rDraw;
            recordsTotal = totalRecords;
            recordsFiltered = FilteredRecords;
        }
    }

    public class BookingsFilterConditions
    {
        public string providerID { get; set; }
        public int? garageID { get; set; }
        public bool IsCanceled { get; set; }
        public bool? IsInThePast { get; set; }
        public bool IsSelfBooking { get; set; }

        public string OrderBy { get; set; }
        public bool IsDescendingOrder { get; set; }
        public int Page { get; set; } = 1;
        public int RecordPerPage { get; set; } = Constants.NUM_OF_SEARCH_RESULT_PER_PAGE;
        public int Draw { get; set; }
    }
}