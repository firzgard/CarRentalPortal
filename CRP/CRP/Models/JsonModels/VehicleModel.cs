using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class VehicleModel
    {
        public int ID { get; set; }
        public string LicenseNumber { get; set; }
        public string Name { get; set; }
        public int ModelID { get; set; }
        public int GarageID { get; set; }
        public int VehicleGroupID { get; set; }
        public int TransmissionType { get; set; }
        public string TransmissionDetail { get; set; }
        public int FuelType { get; set; }
        public string Engine { get; set; }
        public int Color { get; set; }
        public string Description { get; set; }
        public decimal Star { get; set; }
    }
}