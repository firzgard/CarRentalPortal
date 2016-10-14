using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models.Entities;

namespace CRP.Models.JsonModels
{
    public class VehicleDetailInfoModel
    {
        public int ID { get; set; }
        public string LicenseNumber { get; set; }
        public string Name { get; set; }
        public int ModelID { get; set; }
        public string ModelName { get; set; }
        public int BrandID { get; set; }
        public string BrandName { get; set; }
        public int GarageID { get; set; }
        public string GarageName { get; set; }
        public Nullable<int> VehicleGroupID { get; set; }
        public string VehicleGroupName { get; set; }
        public int TransmissionTypeID { get; set; }
        public string TransmissionTypeName { get; set; }
        public Nullable<int> FuelTypeID { get; set; }
        public string FuelTypeName { get; set; }
        public int ColorID { get; set; }
        public string ColorName { get; set; }
        public decimal Star { get; set; }
        public int NumOfDoor { get; set; }
        public int NumOfSeat { get; set; }
        public int? Year { get; set; }
        public List<string> Category { get; set; }

        public VehicleDetailInfoModel(Vehicle vehicle)
        {
            this.ID = vehicle.ID;
            this.LicenseNumber = vehicle.LicenseNumber;
            this.Name = vehicle.Name;
            this.ModelID = vehicle.ModelID;
            this.ModelName = vehicle.Model.Name;
            this.BrandID = vehicle.Model.BrandID;
            this.BrandName = vehicle.Model.Brand.Name;
            this.GarageID = vehicle.GarageID;
            this.GarageName = vehicle.Garage.Name;
            this.VehicleGroupID = vehicle.VehicleGroupID;
            this.VehicleGroupName = vehicle.VehicleGroup.Name;

            this.TransmissionTypeID = vehicle.TransmissionType;
            string tmpString = null;
            Constants.TransmissionType.TryGetValue(vehicle.TransmissionType, out tmpString);
            this.TransmissionTypeName = tmpString;

            this.FuelTypeID = vehicle.FuelType;
            tmpString = null;
            Constants.FuelType.TryGetValue((int)(vehicle.FuelType != null ? vehicle.FuelType : 0), out tmpString);
            this.FuelTypeName = tmpString;

            this.ColorID = vehicle.Color;
            tmpString = null;
            Constants.Color.TryGetValue(vehicle.Color, out tmpString);
            this.ColorName = tmpString;

            this.Star = vehicle.Star;
            this.NumOfDoor = vehicle.Model.NumOfDoor;
            this.NumOfSeat = vehicle.Model.NumOfSeat;
            this.Year = vehicle.Year;
            this.Category = vehicle.Model.Categories.Aggregate(
                new List<string>(), (categories, mapping) => { categories.Add(mapping.Name); return categories; });
        }
        public class VehicleFilterCondition
        {
            public int[] GarageIDList { get; set; }
            public int?[] VehicleGroupIDList { get; set; }

            public string LicenseNumber { get; set; }
            public string Name { get; set; }
            public int[] BrandIDList { get; set; }
            public int[] CategoryIDList { get; set; }

            public int[] FuelTypeIDList { get; set; }
            public int[] TransmissionTypeIDList { get; set; }

            public int? NumOfSeatFrom { get; set; }
            public int? NumOfSeatTo { get; set; }

            public decimal? RateFrom { get; set; }
            public decimal? RateTo { get; set; }

            public int? YearFrom { get; set; }
            public int? YearTo { get; set; }

            public string OrderBy { get; set; }
            public bool IsAscending { get; set; }
            public int Page { get; set; } = 1;
        }
    }
}