using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.ViewModels
{
    public class ReportViewModel
    {
        public int booking { get; set; }
        public int bookingSuccess { get; set; }
        public int vehicle { get; set; }
        public float money { get; set; }
        public int provider { get; set; }
        public int providerActive { get; set; }
        public int customer { get; set; }
        public int customerActive { get; set; }
        public int garage { get; set; }
        public int garageActive { get; set; }
    }
}