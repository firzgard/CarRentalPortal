using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class VehicleGroupModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public Nullable<int> MaxRentalPeriod { get; set; }
        public int DefaultPriceGroupID { get; set; }
    }
}