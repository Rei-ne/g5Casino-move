//
//  ContentView.swift
//  Todo App
//
//  Created by Roberta Marino on 04/11/23.
//

import SwiftUI
import CoreData
import UIKit

struct ContentView: View {
    //MARK: PROPERTIES
    
    //MARK: BODY
    
    @State private var showingAddTodoView: Bool = false
    
    @Environment(\.managedObjectContext)var managedObjectContext
    //@Environment(\.managedObjectContext) private var viewContext

    @FetchRequest(
        sortDescriptors: [NSSortDescriptor(keyPath: \Todo.namex, ascending: true)],
        animation: .default)
    private var Todos: FetchedResults<Todo>

    var body: some View {
        NavigationView {
            
            
            List {
                ForEach(self.Todos,id: \.self){ Todo in
                    HStack{
                        Text(Todo.namex ?? "Unknown")
                    }
                }//:Foreach
                .onDelete(perform: deleteTodo(at:))
                /*
                ForEach(Todos) { todo in
                    NavigationLink {
                        Text("Item at \(todo.namex!, formatter: todoFormatter)")
                    } label: {
                        
                        Text(todo.namex! , formatter: todoFormatter)
                    }
                }
                .onDelete(perform: deleteItems)
                 */
            }
            //MARK ADD ITEM PLUS BUTTON
            .navigationBarTitle("Todo", displayMode: .inline)
            .navigationBarItems(trailing: Button(action: {
                // Show add todo
                //self.$showingAddTodoView.toogle
                if showingAddTodoView == false{
                    showingAddTodoView = true
                }else{
                    showingAddTodoView = false
                }
            }){
                Image(systemName: "plus")
            }//:ADD BUTTON
                .sheet(isPresented: $showingAddTodoView){
                    AddTodoView().environment(\.managedObjectContext, self.managedObjectContext)
                    }
            )
            
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    EditButton()
                }
                ToolbarItem {
                    Button(action: addItem) {
                        Label("Add Item", systemImage: "plus")
                    }
                }
            }
            Text("Select an item")
        }
    }

    private func addItem() {
        withAnimation {
            let newItem = Item(context: managedObjectContext)
            newItem.timestamp = Date()

            do {
                try managedObjectContext.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nsError = error as NSError
                fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
            }
        }
    }
    
    
    private func deleteTodo(at offsets: IndexSet){
        for index in offsets {
            let todo = Todos[index]
            managedObjectContext.delete(todo)
            
            do{
                try managedObjectContext.save()
            }catch{
                print(error)
            }
        }
    }
/*
    private func deleteItems(offsets: IndexSet) {
        withAnimation {
            offsets.map { Todos[$0] }.forEach(managedObjectContext.delete)

            do {
                try managedObjectContext.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nsError = error as NSError
                fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
            }
        }
    }*/
}

private let todoFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateStyle = .short
    formatter.timeStyle = .medium
    return formatter
}()

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        //let context = (UIApplication.shared.delegate as! UIApplicationDelegate).NSPersistentContainer.viewContext
       
         
        //let context = (UIApplication.shared.delegate!) .persistentContainer.viewContext
        
        ContentView()
            .environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
            //.environment(\.managedObjectContext, context as! NSManagedObjectContext)
    }
}
