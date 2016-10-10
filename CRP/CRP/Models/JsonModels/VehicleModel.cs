using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CRP.Models.Entities;

namespace CRP.Models.JsonModels
{
    public class VehicleModel
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
        public int Year { get; set; }
        public string Category { get; set; }

        // implement IEnumerable
        public VehicleModel(Vehicle vehicle)
        {
            this.vehicle = vehicle;
        }

        //public VehicleModel this[int index]
        //{
        //    get { return Vehicles[index]; }
        //    set { Vehicles.Insert(index, value); }
        //}

        //public IEnumerator<VehicleModel> GetEnumerator()
        //{
        //    return Vehicles.GetEnumerator();
        //}

        //IEnumerator IEnumerable.GetEnumerator()
        //{
        //    return this.GetEnumerator();
        //}
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