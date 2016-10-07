using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class BookingReceiptModel
    {
        public int ID { get; set; }
        public int CustomerID { get; set; }
        public int VehicleID { get; set; }
        public double TotalPrice { get; set; }
        public double BookingFee { get; set; }
        public Nullable<decimal> Star { get; set; }
        public string Comment { get; set; }
        public System.DateTime StartTime { get; set; }
        public System.DateTime EndTime { get; set; }
        public bool IsCanceled { get; set; }
        public string VehicleName { get; set; }
        public string GarageName { get; set; }
        public string GarageAddress { get; set; }
    }
}