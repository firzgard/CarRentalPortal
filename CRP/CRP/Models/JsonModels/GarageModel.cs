using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class GarageModel
    {
        public int ID { get; set; }
        public int OwnerID { get; set; }
        public string Name { get; set; }
        public int LocationID { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public decimal Star { get; set; }
        public bool IsActive { get; set; }
        public DateTime OpenTimeMon { get; set; }
        public DateTime CloseTimeMon { get; set; }
        public DateTime OpenTimeTue { get; set; }
        public DateTime CloseTimeTue { get; set; }
        public DateTime OpenTImeWed { get; set; }
        public DateTime CloseTImeWed { get; set; }
        public DateTime OpenTimeThur { get; set; }
        public DateTime CloseTimeThur { get; set; }
        public DateTime OpenTimeFri { get; set; }
        public DateTime CloseTimeFri { get; set; }
        public DateTime OpenTimeSat { get; set; }
        public DateTime CloseTimeSat { get; set; }
        public DateTime OpenTimeSun { get; set; }
        public DateTime CloseTimeSun { get; set; }
    }
}