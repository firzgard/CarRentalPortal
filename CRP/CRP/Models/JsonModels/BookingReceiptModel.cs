using CRP.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.JsonModels
{
    public class BookingReceiptModel
    {
        public List<BookingReceipt> listReceipt { get; set; }
        public int numberPage { get; set; }

        public BookingReceiptModel()
        {
            listReceipt = new List<BookingReceipt>();
        }
    }
}