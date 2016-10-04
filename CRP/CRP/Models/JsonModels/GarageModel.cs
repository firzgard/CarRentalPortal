using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class GarageModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int LocationID { get; set; }
        public string LocationName { get; set; }
        public string Address { get; set; }
        public decimal Star { get; set; }
        public bool IsActive { get; set; }
    }
}