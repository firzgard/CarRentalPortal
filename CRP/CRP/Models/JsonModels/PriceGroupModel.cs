using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class PriceGroupModel
    {
        public int ID { get; set; }
        public double Deposit { get; set; }
        public double PerDayPrice { get; set; }
    }
}