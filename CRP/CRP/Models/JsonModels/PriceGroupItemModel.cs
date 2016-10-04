using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class PriceGroupItemModel
    {
        public int ID { get; set; }
        public int PriceGroupID { get; set; }
        public int MaxTime { get; set; }
        public double Price { get; set; }
    }
}