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
        public int ModelName { get; set; }
        public int BrandID { get; set; }
        public string BrandName { get; set; }
        public int GarageID { get; set; }
        public string GarageName { get; set; }
        public int VehicleGroupID { get; set; }
        public string VehicleName { get; set; }
        public int TransmissionTypeID { get; set; }
        public string TransmissionTypeName { get; set; }
        public int FuelTypeID { get; set; }
        public string FuelTypeName { get; set; }
        public int ColorID { get; set; }
        public string ColorName { get; set; }
        public decimal Star { get; set; }
        public int NumOfDoor { get; set; }
        public int NumOfSeat { get; set; }
    }
}