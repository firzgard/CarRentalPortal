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
        public int? VehicleID { get; set; }
        public string VehicleName { get; set; }
        public string LicenseNumber { get; set; }
        public double RentalPrice { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal? Star { get; set; }
        public string Comment { get; set; }
        public BookingsRecordJsonModel(BookingReceipt receipt)
        {
            ID = receipt.ID;
            VehicleID = receipt.VehicleID;
            VehicleName = receipt.VehicleName;
            LicenseNumber = receipt.LicenseNumber;
            RentalPrice = receipt.RentalPrice;
            StartTime = receipt.StartTime;
            EndTime = receipt.EndTime;
            Star = receipt.Star;
            Comment = receipt.Comment;
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
}